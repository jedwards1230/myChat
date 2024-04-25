import z from "zod";

//import { OpenAiModels } from "./types";
import { constructZodLiteralUnionType } from "@/lib/zod";

const GPT3 = ["gpt-3.5-turbo-1106", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"] as const;
type GPT3 = (typeof GPT3)[number];
const GPT4 = ["gpt-4-turbo", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613"] as const;
type GPT4 = (typeof GPT4)[number];

export const OpenAiModels = [...GPT3, ...GPT4] as const;
export type OpenAiModels = (typeof OpenAiModels)[number];

export const LlamaModels = ["llama-2-7b-chat-int8"] as const;
export type LlamaModels = (typeof LlamaModels)[number];

export const Models = [...OpenAiModels, ...LlamaModels] as const;
export type Model = OpenAiModels | LlamaModels;

const OpenAiModelLiteral = constructZodLiteralUnionType(OpenAiModels);
export type OpenAiModelLiteral = z.infer<typeof OpenAiModelLiteral>;

const LlamaModelLiteral = z.literal("llama-2-7b-chat-int8");
export type LlamaModelLiteral = z.infer<typeof LlamaModelLiteral>;

export const ModelLiteral = z.union([OpenAiModelLiteral, LlamaModelLiteral]);
export type ModelLiteral = z.infer<typeof ModelLiteral>;

const ModelParams = z.object({
	temperature: z.optional(z.number()),
	topP: z.optional(z.number()),
	N: z.optional(z.number()),
	maxTokens: z.optional(z.number()),
	frequencyPenalty: z.optional(z.number()),
	presencePenalty: z.optional(z.number()),
	canStream: z.optional(z.boolean()),
});

const OpenAiApiInfo = z.object({
	name: OpenAiModelLiteral,
	api: z.literal("openai"),
});
export type OpenAiApiInfo = z.infer<typeof OpenAiApiInfo>;

const LlamaApiInfo = z.object({ name: LlamaModelLiteral, api: z.literal("llama") });
export type LlamaApiInfo = z.infer<typeof LlamaApiInfo>;

export const ModelInfoSchema = z.intersection(
	z.union([OpenAiApiInfo, LlamaApiInfo]),
	z.object({ params: ModelParams })
);
export type ModelInfoSchema = z.infer<typeof ModelInfoSchema>;

export const ModelListSchema = z.array(ModelInfoSchema);
export type ModelListSchema = z.infer<typeof ModelListSchema>;
