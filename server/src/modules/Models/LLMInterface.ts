import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";
import type { ChatCompletion } from "openai/resources/index";

import type { Message } from "@/modules/Message/MessageModel";

import { OpenAIService } from "./Providers/openai";

export interface LLMNexus {
	createChatCompletionStream(
		threadMessages: Message[]
	): Promise<ChatCompletionStreamingRunner>;
	createChatCompletionJSON(threadMessages: Message[]): Promise<ChatCompletion>;
	createTitleFromChatHistory(messages: Message[]): Promise<string>;
}

type ServiceName = "OpenAIService";

class NexusServiceRegistry {
	private static services: Map<ServiceName, LLMNexus> = new Map();

	static registerService(name: ServiceName, service: LLMNexus) {
		this.services.set(name, service);
	}

	static getService(name: ServiceName): LLMNexus | undefined {
		return this.services.get(name);
	}
}

NexusServiceRegistry.registerService("OpenAIService", new OpenAIService());

class NexusDispatcherClass implements LLMNexus {
	async createChatCompletion(threadMessages: Message[], stream: boolean) {
		return stream
			? this.createChatCompletionStream(threadMessages)
			: this.createChatCompletionJSON(threadMessages);
	}

	async createChatCompletionStream(threadMessages: Message[]) {
		// Logic to determine which service to use
		const serviceName = "OpenAIService"; // Example, could be dynamic
		const service = NexusServiceRegistry.getService(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}
		return service.createChatCompletionStream(threadMessages);
	}

	async createChatCompletionJSON(threadMessages: Message[]) {
		// Logic to determine which service to use
		const serviceName = "OpenAIService"; // Example, could be dynamic
		const service = NexusServiceRegistry.getService(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}
		return service.createChatCompletionJSON(threadMessages);
	}

	async createTitleFromChatHistory(messages: Message[]) {
		// Logic to determine which service to use
		const serviceName = "OpenAIService"; // Example, could be dynamic
		const service = NexusServiceRegistry.getService(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}
		const cleanedMessages = this.removeSystemMessage(messages);
		return service.createTitleFromChatHistory(cleanedMessages);
	}

	private removeSystemMessage(messages: Message[]) {
		return messages.filter((msg) => msg.role !== "system");
	}
}

export const NexusDispatcher = new NexusDispatcherClass();
