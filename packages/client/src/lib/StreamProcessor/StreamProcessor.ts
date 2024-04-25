import { ReadableStream } from "web-streams-polyfill";
import { Platform } from "react-native";

import { messagesQueryOptions } from "@/hooks/fetchers/Message/useMessagesQuery";
import { Message } from "@/types";
import { ChatCompletionStream } from "./ChatCompletionStream";
import { emitFeedback } from "../FeedbackEmitter";

type QueryOpts = ReturnType<typeof messagesQueryOptions>;

export const getStreamProcessor = ({
    stream,
    opts,
    addMessage,
    updateMessage,
    finalMessage,
}: {
    stream: ReadableStream;
    opts: QueryOpts;
    addMessage: (message: Message, opts: QueryOpts) => void;
    updateMessage: (content: string, opts: QueryOpts) => void;
    finalMessage: (opts: QueryOpts) => void;
}) =>
    new Promise<void>((resolve, reject) => {
        try {
            const streamRunner = ChatCompletionStream.fromReadableStream(
                stream,
                Platform.OS !== "web"
            );

            streamRunner
                .on("error", (error) => reject(error))
                .on("end", () => resolve())
                .on("abort", () => null)
                .on("chunk", (chunk) => {
                    const delta = chunk.choices[0].delta as Message;
                    if (delta.role) addMessage(delta, opts);
                    emitFeedback();
                })
                .on("content", async (_, content) => updateMessage(content, opts))
                .on("finalMessage", () => {
                    finalMessage(opts);
                    resolve();
                });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
