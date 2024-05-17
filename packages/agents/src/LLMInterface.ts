import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";

import type { MessageObjectSchema as Message } from "@mychat/shared/schemas/Message";
import type { ChatModel } from "@mychat/shared/schemas/models";

import { OpenAIService } from "@mychat/agents/providers/openai";
import type { ToolConfig } from "@mychat/agents/tools/types";
import type { ModelApi } from "@mychat/agents/models/types";

export type ChatOptions = {
	tools: ToolConfig[];
	model: ChatModel;
	stream: boolean;
};

export interface LLMNexus {
	createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream | ChatCompletion>;
	createChatCompletionStream(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream>;
	createChatCompletionJSON(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletion>;
	createTitleCompletionJSON(
		messages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionRunner>;
}

type ServiceName = ModelApi["serviceName"];

export class NexusServiceRegistry {
	private static services: Map<ServiceName, LLMNexus> = new Map();

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
