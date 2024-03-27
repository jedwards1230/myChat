import type { ChatCompletionChunk, ChatCompletionMessageParam } from "openai/resources";

import type { Message } from "@/types";

interface Error {
	type: "error";
	data: string;
}

interface GetChat {
	type: "getChat";
	data: {
		threadId?: string | null;
		userId?: string;
	};
}

interface Chunk {
	type: "chunk";
	data: ChatCompletionChunk.Choice.Delta;
}

interface Content {
	type: "content";
	data: string;
}

interface Tool {
	type: "tool";
	data: Message;
}

interface FinalMessage {
	type: "finalMessage";
	data: boolean;
}

interface TestMessage {
	type: "test";
}

export type SocketClientMessage = Error | GetChat | TestMessage;

export type SocketServerMessage = Error | Chunk | Content | Tool | FinalMessage;
