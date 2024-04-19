import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";
import type { ChatCompletion } from "openai/resources/index";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";

import type { Message } from "@/modules/Message/MessageModel";
import { OpenAIService, type OpenAiModels } from "./Providers/openai";
import type { ToolConfig } from "./Tools/types";

export type ChatOptions = {
	tools: ToolConfig[];
	model: OpenAiModels;
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
