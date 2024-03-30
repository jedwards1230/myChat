import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";
import type { ChatCompletion } from "openai/resources/index";

import type { Message } from "@/modules/Message/MessageModel";
import { OpenAIService, type OpenAiModels } from "./Providers/openai";
import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";

export type ChatOptions = {
	tools: RunnableToolFunction<any>[];
	model: OpenAiModels;
	stream: boolean;
};

export interface LLMNexus {
	createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionStreamingRunner | ChatCompletion>;
	createChatCompletionStream(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionStreamingRunner>;
	createChatCompletionJSON(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletion>;
	createTitleFromChatHistory(messages: Message[], opts: ChatOptions): Promise<string>;
}

type ServiceName = "OpenAIService";

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