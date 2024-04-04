import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";

import { Message } from "@/types";

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
		.on("error", (error) => console.error("Stream Error", error))
		.on("chunk", (chunk) => {
			const delta = chunk.choices[0].delta as Message;
			if (delta.role) addMessage(delta);
		})
		.on("content", async (chunk, content) => updateMessage(content))
		.on("finalMessage", () => finalMessage());
}
