import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import * as Haptics from "expo-haptics";

import { Message } from "@/types";
import { Platform } from "react-native";

export function handleStreamResponse(
	res: ReadableStream<Uint8Array>,
	{
		addMessage,
		updateMessage,
		finalMessage,
	}: {
		/** Triggered on the first message. Should add a blank message to messages list */
		addMessage: (message: Message) => void;
		/** Finds last message (from addMessage) and sets the content equal to this. This param is the accumulated content, so appending is not needed. */
		updateMessage: (content: string) => void;
		/** Mark loading complete and clean up */
		finalMessage: () => void;
	}
) {
	const streamRunner = ChatCompletionStreamingRunner.fromReadableStream(res);
	streamRunner
		.on("connect", () => {
			console.log("Stream Connected");
		})
		.on("error", (error) => {
			console.error("Stream Error", error);
		})
		.on("chunk", (chunk) => {
			const delta = chunk.choices[0].delta as Message;

			if (delta.role) {
				addMessage(delta);
			}

			if (Platform.OS === "ios") {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
		})
		.on("content", (content) => {
			updateMessage(content);
		})
		.on("message", (message) => {
			console.log("Stream Message", message);
		})
		.on("finalMessage", (message) => {
			finalMessage();
		});
}
