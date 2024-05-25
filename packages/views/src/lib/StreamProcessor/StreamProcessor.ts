import type { ReadableStream } from "web-streams-polyfill";
import { Platform } from "react-native";

import type { Message } from "@mychat/db/schema";

import { emitFeedback } from "../FeedbackEmitter";
import { ChatCompletionStream } from "./ChatCompletionStream";

export const getStreamProcessor = ({
	stream,
	addMessage,
	updateMessage,
	finalMessage,
}: {
	stream: ReadableStream;
	addMessage: (message: Message) => void;
	updateMessage: (content: string) => void;
	finalMessage: () => Promise<void>;
}) =>
	new Promise<void>((resolve, reject) => {
		try {
			const streamRunner = ChatCompletionStream.fromReadableStream(
				stream,
				Platform.OS !== "web",
			);

			streamRunner
				.on("error", (error) => reject(error))
				.on("end", () => resolve())
				.on("abort", () => null)
				.on("chunk", (chunk) => {
					const delta = chunk.choices[0]?.delta as Message;
					if (delta.role) addMessage(delta);
					emitFeedback();
				})
				.on("content", async (_, content) => updateMessage(content))
				.on("finalMessage", () => {
					finalMessage();
					resolve();
				});

			resolve();
		} catch (error) {
			reject(error);
		}
	});
