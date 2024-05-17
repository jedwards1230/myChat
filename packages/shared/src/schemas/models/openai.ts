import z from "zod";
import { ModelParams } from "./params";

const GPT3 = z.union([
	z.literal("gpt-3.5-turbo-1106"),
	z.literal("gpt-3.5-turbo"),
	z.literal("gpt-3.5-turbo-16k"),
]);
type GPT3 = z.infer<typeof GPT3>;
const GPT4 = z.union([
	z.literal("gpt-4o"),
	z.literal("gpt-4-turbo"),
	z.literal("gpt-4-vision-preview"),
	z.literal("gpt-4"),
	z.literal("gpt-4-0613"),
]);
type GPT4 = z.infer<typeof GPT4>;

const TextEmbedding3 = z.union([
	z.literal("text-embedding-3-small"),
	z.literal("text-embedding-3-large"),
]);
type TextEmbedding3 = z.infer<typeof TextEmbedding3>;

const OpenAiChatModels = z.union([GPT3, GPT4]);
type OpenAiChatModels = z.infer<typeof OpenAiChatModels>;

const OpenAiEmbeddingModels = TextEmbedding3;
type OpenAiEmbeddingModels = z.infer<typeof OpenAiEmbeddingModels>;

export const OpenAiModels = z.union([OpenAiChatModels, OpenAiEmbeddingModels]);
export type OpenAiModels = z.infer<typeof OpenAiModels>;

export const OpenAiChatParams = z.object({
	name: OpenAiChatModels,
	params: ModelParams,
	serviceName: z.literal("OpenAIService"),
	api: z.literal("openai"),
});
export type OpenAiChatParams = z.infer<typeof OpenAiChatParams>;

export const OpenAiEmbeddingParams = z.object({
	name: OpenAiModels,
	params: ModelParams,
	serviceName: z.literal("OpenAIService"),
	api: z.literal("openai"),
});
export type OpenAiEmbeddingParams = z.infer<typeof OpenAiEmbeddingParams>;

export const OpenAiApiInfo = z.union([OpenAiChatParams, OpenAiEmbeddingParams]);
export type OpenAiApiInfo = z.infer<typeof OpenAiApiInfo>;

export const OpenAiProvider = z.literal("openai");
