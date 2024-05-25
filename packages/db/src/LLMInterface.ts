import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";

import type { Message } from "@mychat/db/schema";
import type { ToolConfig } from "@mychat/db/schema/tools/types.js";
import { OpenAIService } from "@mychat/db/schema/providers/openai.js";

import type { ChatModel, ModelApi } from "./schema/models";

export interface ChatOptions {
	tools: ToolConfig[];
	model: ChatModel;
	stream: boolean;
}

export interface LLMNexus {
	createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions,
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream | ChatCompletion>;
	createChatCompletionStream(
		threadMessages: Message[],
		opts: ChatOptions,
	): ChatCompletionStreamingRunner | ChatCompletionStream;
	createChatCompletionJSON(
		threadMessages: Message[],
		opts: ChatOptions,
	): Promise<ChatCompletion>;
	createTitleCompletionJSON(
		messages: Message[],
		opts: ChatOptions,
	): ChatCompletionRunner;
}

type ServiceName = ModelApi["serviceName"];

export class NexusServiceRegistry {
	private static services = new Map<ServiceName, LLMNexus>();

	static registerService(name: ServiceName, service: LLMNexus) {
		this.services.set(name, service);
	}

	static getService(name: ServiceName): LLMNexus {
		const service = this.services.get(name);
		if (!service) throw new Error(`Service ${name} not found`);
		return service;
	}
}

NexusServiceRegistry.registerService("OpenAIService", new OpenAIService());
