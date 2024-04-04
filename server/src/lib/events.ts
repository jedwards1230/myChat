import { EventEmitter } from "events";

import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";

export interface ChatResponseEmitterEvents {
	responseJSONReady: {
		threadId: string;
		response: ChatCompletion;
	};
	responseStreamReady: {
		threadId: string;
		response: ChatCompletionStreamingRunner | ChatCompletionStream;
	};
}

export class ChatResponseEmitter extends EventEmitter {
	constructor() {
		super();
	}

	sendResponseReady<T extends keyof ChatResponseEmitterEvents>(
		type: T,
		data: ChatResponseEmitterEvents[T]
	) {
		this.emit(type, data);
	}

	on<E extends keyof ChatResponseEmitterEvents>(
		event: E,
		listener: (data: ChatResponseEmitterEvents[E]) => void
	): this {
		return super.on(event, listener);
	}
}

export const chatResponseEmitter = new ChatResponseEmitter();
