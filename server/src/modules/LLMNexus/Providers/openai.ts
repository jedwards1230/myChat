import OpenAI from "openai";
import {
	type ChatCompletion,
	type ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { type ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";

import type { Message } from "../../Message/MessageModel";
import logger from "@/lib/logs/logger";
import type { ChatOptions, LLMNexus } from "../LLMInterface";

export const openai = new OpenAI();

export type OpenAiModels = ChatCompletionCreateParamsBase["model"];

export class OpenAIService implements LLMNexus {
	async createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<any> {
		return opts.stream
			? this.createChatCompletionStream(threadMessages, opts)
			: this.createChatCompletionJSON(threadMessages, opts);
	}

	async createChatCompletionStream(
		threadMessages: Message[],
		{ tools, stream, ...opts }: ChatOptions
	): Promise<ChatCompletionStreamingRunner> {
		if (!stream) throw new Error("Stream option must be true");
		const messages = this.formatMessages(threadMessages);
		return tools.length > 0
			? openai.beta.chat.completions
					.runTools({
						stream: true,
						messages,
						tools,
						...opts,
					})
					.on("error", (error) => {
						logger.error("Stream error", { error });
					})
			: (openai.chat.completions.create({
					stream: true,
					messages,
					...opts,
			  }) as unknown as ChatCompletionStreamingRunner);
	}

	async createChatCompletionJSON(
		threadMessages: Message[],
		{ tools, stream, ...opts }: ChatOptions
	): Promise<ChatCompletion> {
		if (stream) throw new Error("Stream option must be false");
		const messages = this.formatMessages(threadMessages);
		return openai.chat.completions.create({
			messages,
			...opts,
		});
	}

	async createTitleFromChatHistory(
		messages: Message[],
		{ tools, stream, ...opts }: ChatOptions
	): Promise<string> {
		const SYSTEM_MESSAGE = `Generate a thread title for the provided conversation history. 
			Only respond with the title. 
			Do not include any other information. 
			Do not include unnecessary punctuation. 
			Do not wrap the title in quotes.
			Ensure the title is as general to the conversation as possible.`;

		const response = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: SYSTEM_MESSAGE,
				},
				{
					role: "user",
					content: JSON.stringify(
						messages.map((m) => ({
							role: m.role,
							content: m.content,
						}))
					),
				},
			],
			...opts,
		});

		if (!response.choices[0].message.content) throw new Error("No title generated");

		return response.choices[0].message.content;
	}

	private formatMessages(messages: Message[]): ChatCompletionMessageParam[] {
		return messages
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.map(this.formatMessage);
	}

	private formatMessage(msg: Message): ChatCompletionMessageParam {
		return {
			role: msg.role as any,
			content: msg.content || "",
			...(msg.tool_calls &&
				msg.tool_calls.length > 0 && { tool_calls: msg.tool_calls }),
			...(msg.role === "tool" && { tool_call_id: msg.tool_call_id?.id }),
		};
	}
}
