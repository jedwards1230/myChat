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
		addMessage: (message: Message) => void;
		updateMessage: (content: string) => void;
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
