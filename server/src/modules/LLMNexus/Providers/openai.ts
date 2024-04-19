import OpenAI from "openai";
import {
	type ChatCompletion,
	type ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { type ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";

import type { Message } from "../../Message/MessageModel";
import type { ChatOptions, LLMNexus } from "../LLMInterface";
import { runnableSaveTitle } from "../Tools/newTitle";
import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";

export const openai = new OpenAI();

export type OpenAiModels = ChatCompletionCreateParamsBase["model"];

export class OpenAIService implements LLMNexus {
	async createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream | ChatCompletion> {
		return opts.stream
			? this.createChatCompletionStream(threadMessages, opts)
			: this.createChatCompletionJSON(threadMessages, opts);
	}

	async createChatCompletionStream(
		threadMessages: Message[],
		{ tools, stream, ...opts }: ChatOptions
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream> {
		if (stream === false) throw new Error("Stream option must be true");
		const messages = this.formatMessages(threadMessages);
		return tools.length > 0
			? openai.beta.chat.completions.runTools({
					stream,
					messages,
					tools: tools.map((tool) => tool.getTools()).flat(),
					...opts,
			  })
			: openai.beta.chat.completions.stream({
					stream,
					messages,
					...opts,
			  });
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

	async createTitleCompletionJSON(
		messages: Message[],
		{ tools, stream, ...opts }: ChatOptions
	): Promise<ChatCompletionRunner> {
		if (stream) throw new Error("Stream option must be false");
		const cleanedMessages = this.formatMessages(messages);
		return openai.beta.chat.completions.runTools({
			tools: [runnableSaveTitle],
			tool_choice: runnableSaveTitle,
			messages: cleanedMessages,
			...opts,
		});
	}

	private formatMessages(messages: Message[]): ChatCompletionMessageParam[] {
		return messages.map(this.formatMessage);
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
