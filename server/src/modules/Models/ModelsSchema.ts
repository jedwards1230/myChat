import z from "zod";
import { getListByApi } from "./data";
import { constructZodLiteralUnionType } from "@/lib/zod";

const OpenAiModelLiteral = constructZodLiteralUnionType(
	getListByApi("openai").map((m) => z.literal(m.name))
);
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
