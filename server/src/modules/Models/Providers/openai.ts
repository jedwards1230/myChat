import OpenAI from "openai";
import {
	type ChatCompletion,
	type ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

import type { Message } from "../../Message/MessageModel";
import logger from "@/lib/logs/logger";
import { Browser } from "../Tools/browser/browser";
import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";
import type { LLMNexus } from "../LLMInterface";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";

export const openai = new OpenAI();

const tools: RunnableToolFunction<any>[] = [...Browser.getTools()];

export class OpenAIService implements LLMNexus {
	async createChatCompletionStream(
		threadMessages: Message[]
	): Promise<ChatCompletionStreamingRunner> {
		const messages = this.formatMessages(threadMessages);
		return openai.beta.chat.completions
			.runTools({
				model: "gpt-4-0125-preview",
				stream: true,
				messages,
				tools,
			})
			.on("error", (error) => {
				logger.error("Stream error", { error });
			});
	}

	async createChatCompletionJSON(threadMessages: Message[]): Promise<ChatCompletion> {
		const messages = this.formatMessages(threadMessages);
		return openai.chat.completions.create({
			model: "gpt-4-0125-preview",
			stream: false,
			messages,
		});
	}

	async createTitleFromChatHistory(messages: Message[]): Promise<string> {
		const SYSTEM_MESSAGE = `Generate a thread title for the provided conversation history. 
			Only respond with the title. 
			Do not include any other information. 
			Do not include unnecessary punctuation. 
			Do not wrap the title in quotes.
			Ensure the title is as general to the conversation as possible.`;

		const response = await openai.chat.completions.create({
			model: "gpt-4-0125-preview",
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
