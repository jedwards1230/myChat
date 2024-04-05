import { ReadableStream } from "web-streams-polyfill";

import { messagesQueryOptions } from "@/lib/queries/useMessagesQuery";
import { Message } from "@/types";
import { ChatCompletionStream } from "./ChatCompletionStream";
import { emitFeedback } from "../helpers";
import { Platform } from "react-native";

type QueryOpts = ReturnType<typeof messagesQueryOptions>;

export const getStreamProcessor = ({
	stream,
	opts,
	addMessage,
	updateMessage,
}: {
	stream: ReadableStream;
	opts: QueryOpts;
	addMessage: (message: Message, opts: QueryOpts) => void;
	updateMessage: (content: string, opts: QueryOpts) => void;
}) =>
	new Promise<void>(async (resolve, reject) => {
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
				.on("finalMessage", () => resolve());

			resolve();
		} catch (error) {
			reject(error);
		}
	});
