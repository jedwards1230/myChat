import { ReadableStream } from "web-streams-polyfill";

import { OpenAIError } from "openai";

export type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined;

export type ServerSentEvent = {
    event: string | null;
    data: string;
    raw: string[];
};

export class Stream<Item> implements AsyncIterable<Item> {
    controller: AbortController;

    constructor(
        private iterator: () => AsyncIterator<Item>,
        controller: AbortController
    ) {
        this.controller = controller;
    }

    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream<Item>(
        readableStream: ReadableStream,
        controller: AbortController
    ) {
        let consumed = false;

        async function* iterLines(): AsyncGenerator<string, void, unknown> {
            const lineDecoder = new LineDecoder();

            const iter = readableStreamAsyncIterable<Bytes>(readableStream);
            for await (const chunk of iter) {
                for (const line of lineDecoder.decode(chunk)) {
                    yield line;
                }
            }

            for (const line of lineDecoder.flush()) {
                yield line;
            }
        }

        async function* iterator(): AsyncIterator<Item, any, undefined> {
            if (consumed) {
                throw new Error(
                    "Cannot iterate over a consumed stream, use `.tee()` to split the stream."
                );
            }
            consumed = true;
            let done = false;
            try {
                for await (const line of iterLines()) {
                    if (done) continue;
                    if (line) yield JSON.parse(line);
                }
                done = true;
            } catch (e) {
                // If the user calls `stream.controller.abort()`, we should exit without throwing.
                if (e instanceof Error && e.name === "AbortError") return;
                throw e;
            } finally {
                // If the user `break`s, abort the ongoing request.
                if (!done) controller.abort();
            }
        }

        return new Stream(iterator, controller);
    }

    [Symbol.asyncIterator](): AsyncIterator<Item> {
        return this.iterator();
    }

    /**
     * Splits the stream into two streams which can be
     * independently read from at different speeds.
     */
    tee(): [Stream<Item>, Stream<Item>] {
        const left: Array<Promise<IteratorResult<Item>>> = [];
        const right: Array<Promise<IteratorResult<Item>>> = [];
        const iterator = this.iterator();

        const teeIterator = (
            queue: Array<Promise<IteratorResult<Item>>>
        ): AsyncIterator<Item> => {
            return {
                next: () => {
                    if (queue.length === 0) {
                        const result = iterator.next();
                        left.push(result);
                        right.push(result);
                    }
                    return queue.shift()!;
                },
            };
        };

        return [
            new Stream(() => teeIterator(left), this.controller),
            new Stream(() => teeIterator(right), this.controller),
        ];
    }

    /**
     * Converts this stream to a newline-separated ReadableStream of
     * JSON stringified values in the stream
     * which can be turned back into a Stream with `Stream.fromReadableStream()`.
     */
    toReadableStream(): ReadableStream {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        let iter: AsyncIterator<Item>;
        const encoder = new TextEncoder();

        return new ReadableStream({
            async start() {
                iter = self[Symbol.asyncIterator]();
            },
            async pull(ctrl: any) {
                try {
                    const { value, done } = await iter.next();
                    if (done) return ctrl.close();

                    const bytes = encoder.encode(JSON.stringify(value) + "\n");

                    ctrl.enqueue(bytes);
                } catch (err) {
                    ctrl.error(err);
                }
            },
            async cancel() {
                await iter.return?.();
            },
        });
    }
}

/**
 * A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
 * reading lines from text.
 *
 * https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
 */
export class LineDecoder {
    // prettier-ignore
    static NEWLINE_CHARS = new Set(['\n', '\r']);
    static NEWLINE_REGEXP = /\r\n|[\n\r]/g;

    buffer: string[];
    trailingCR: boolean;
    textDecoder: any; // TextDecoder found in browsers; not typed to avoid pulling in either "dom" or "node" types.

    constructor() {
        this.buffer = [];
        this.trailingCR = false;
    }

    decode(chunk: Bytes): string[] {
        let text = this.decodeText(chunk);

        if (this.trailingCR) {
            text = "\r" + text;
            this.trailingCR = false;
        }
        if (text.endsWith("\r")) {
            this.trailingCR = true;
            text = text.slice(0, -1);
        }

        if (!text) {
            return [];
        }

        const trailingNewline = LineDecoder.NEWLINE_CHARS.has(
            text[text.length - 1] || ""
        );
        let lines = text.split(LineDecoder.NEWLINE_REGEXP);

        // if there is a trailing new line then the last entry will be an empty
        // string which we don't care about
        if (trailingNewline) {
            lines.pop();
        }

        if (lines.length === 1 && !trailingNewline) {
            this.buffer.push(lines[0]!);
            return [];
        }

        if (this.buffer.length > 0) {
            lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
            this.buffer = [];
        }

        if (!trailingNewline) {
            this.buffer = [lines.pop() || ""];
        }

        return lines;
    }

    decodeText(bytes: Bytes): string {
        if (bytes == null) return "";
        if (typeof bytes === "string") return bytes;

        // Node:
        if (typeof Buffer !== "undefined") {
            if (bytes instanceof Buffer) {
                return bytes.toString();
            }
            if (bytes instanceof Uint8Array) {
                return Buffer.from(bytes).toString();
            }

            throw new OpenAIError(
                `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
            );
        }

        // Browser
        if (typeof TextDecoder !== "undefined") {
            if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
                this.textDecoder ??= new TextDecoder("utf8");
                return this.textDecoder.decode(bytes);
            }

            throw new OpenAIError(
                `Unexpected: received non-Uint8Array/ArrayBuffer (${
                    (bytes as any).constructor.name
                }) in a web platform. Please report this error.`
            );
        }

        throw new OpenAIError(
            `Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`
        );
    }

    flush(): string[] {
        if (!this.buffer.length && !this.trailingCR) {
            return [];
        }

        const lines = [this.buffer.join("")];
        this.buffer = [];
        this.trailingCR = false;
        return lines;
    }
}

/** This is an internal helper function that's just used for testing */
export function _decodeChunks(chunks: string[]): string[] {
    const decoder = new LineDecoder();
    const lines: string[] = [];
    for (const chunk of chunks) {
        lines.push(...decoder.decode(chunk));
    }

    return lines;
}

/* function partition(str: string, delimiter: string): [string, string, string] {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [
            str.substring(0, index),
            delimiter,
            str.substring(index + delimiter.length),
        ];
    }

    return [str, "", ""];
} */

/**
 * Most browsers don't yet have async iterable support for ReadableStream,
 * and Node has a very different way of reading bytes from its "ReadableStream".
 *
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
export function readableStreamAsyncIterable<T>(stream: any): AsyncIterableIterator<T> {
    if (stream[Symbol.asyncIterator]) {
        return stream;
    }

    const reader = stream.getReader();
    return {
        async next() {
            try {
                const result = await reader.read();
                if (result?.done) reader.releaseLock(); // release lock when stream becomes closed
                return result;
            } catch (e) {
                reader.releaseLock(); // release lock when stream becomes errored
                throw e;
            }
        },
        async return() {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            await cancelPromise;
            return { done: true, value: undefined };
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}

export function getChunksAsync(stream: ReadableStream<any>) {
    const lineDecoder = new LineDecoder();
    const iters = readableStreamAsyncIterable<Bytes>(stream);

    const lineQueue: (string | null)[] = [];

    (async () => {
        for await (const chunk of iters) {
            for (const line of lineDecoder.decode(chunk)) {
                lineQueue.push(line);
            }
        }

        for (const line of lineDecoder.flush()) {
            lineQueue.push(line);
        }

        // Indicate that no more lines will be added
        lineQueue.push(null);
    })();

    return {
        async next() {
            while (lineQueue.length === 0 || lineQueue[0] !== null) {
                if (lineQueue.length > 0) {
                    const line = lineQueue.shift();
                    if (!line) continue;
                    const msg = JSON.parse(line);
                    return { done: false, value: msg };
                }
                // Wait a bit for new lines to be pushed
                await new Promise((resolve) => setTimeout(resolve, 10));
            }

            // Clean up the queue to release memory
            lineQueue.length = 0;

            return { done: true, value: undefined };
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
