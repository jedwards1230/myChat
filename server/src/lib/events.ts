import { EventEmitter } from "events";

import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";

export interface ChatResponseEmitterEvents {
	responseJSONReady: {
		agentRunId: string;
		response: ChatCompletion;
	};
	responseStreamReady: {
		agentRunId: string;
		response: ChatCompletionStreamingRunner | ChatCompletionStream;
	};
	abort: {
		agentRunId: string;
		error?: Error;
	};
}

export class ChatResponseEmitter extends EventEmitter {
	constructor() {
		super();
	}

	emit<T extends keyof ChatResponseEmitterEvents>(
		eventName: T,
		args: ChatResponseEmitterEvents[T]
	): boolean {
		return super.emit<ChatResponseEmitterEvents>(eventName, args);
	}

	on<E extends keyof ChatResponseEmitterEvents>(
		event: E,
		listener: (data: ChatResponseEmitterEvents[E]) => void
	): this {
		return super.on(event, listener);
	}
}

export const chatResponseEmitter = new ChatResponseEmitter();
