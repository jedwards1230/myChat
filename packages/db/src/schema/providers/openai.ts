import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type {
	ChatCompletion,
	ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import OpenAI from "openai/index.mjs";
import { type ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

import type { ChatOptions, LLMNexus } from "../../LLMInterface";
import type { OpenAiEmbeddingParams } from "../../schema";
import type { InferResultType } from "../../types";
import { logger } from "../../logger";
import { runnableSaveTitle } from "../tools/newTitle";

type Message = InferResultType<"Message", { toolCalls: true }>;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) logger.warn("ENV: OPENAI_API_KEY not found");

export const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

export type OpenAiModels = ChatCompletionCreateParamsBase["model"];

export class OpenAIService implements LLMNexus {
	async createChatCompletion(
		threadMessages: Message[],
		opts: ChatOptions,
	): Promise<ChatCompletionStreamingRunner | ChatCompletionStream | ChatCompletion> {
		return opts.stream
			? this.createChatCompletionStream(threadMessages, opts)
			: this.createChatCompletionJSON(threadMessages, opts);
	}

	createChatCompletionStream(
		threadMessages: Message[],
		{ tools, stream, ...opts }: ChatOptions,
	): ChatCompletionStreamingRunner | ChatCompletionStream {
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
		{ stream, ...opts }: ChatOptions,
	): Promise<ChatCompletion> {
		if (stream) throw new Error("Stream option must be false");
		const messages = this.formatMessages(threadMessages);
		return openai.chat.completions.create({
			messages,
			...opts,
			tools: undefined,
		});
	}

	createTitleCompletionJSON(
		messages: Message[],
		{ stream, ...opts }: ChatOptions,
	): ChatCompletionRunner {
		if (stream === true) throw new Error("Stream option must be false");
		const cleanedMessages = this.formatMessages(messages);
		return openai.beta.chat.completions.runTools({
			...opts,
			tools: [runnableSaveTitle],
			stream,
			tool_choice: runnableSaveTitle,
			messages: cleanedMessages,
		});
	}

	private formatMessages(messages: Message[]): ChatCompletionMessageParam[] {
		return messages.map(this.formatMessage);
	}

	private formatMessage(msg: Message): ChatCompletionMessageParam {
		return {
			role: msg.role as any,
			content: msg.content ?? "",
			...(msg.toolCalls &&
				msg.toolCalls.length > 0 && { tool_calls: msg.toolCalls }),
			...(msg.role === "tool" && { tool_call_id: msg.toolCallId }),
		};
	}
}

type EmbedData = number[];

export async function generateEmbeddings(
	texts: string[],
	opts: OpenAiEmbeddingParams,
): Promise<EmbedData[][]> {
	const response = await openai.embeddings.create({
		input: texts,
		model: opts.name,
	});
	return [response.data.map((v) => v.embedding)];
}

export async function generateEmbedding(
	input: string,
	opts: OpenAiEmbeddingParams,
): Promise<EmbedData[]> {
	const response = await openai.embeddings.create({
		input,
		model: opts.name,
	});
	const embedding = response.data[0]?.embedding;
	if (!embedding) throw new Error("Failed to generate embedding for input");
	return [embedding];
}
