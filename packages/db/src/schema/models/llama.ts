import z from "zod";

import { ModelParams } from "./params";

export const LlamaModels = z.literal("llama-2-7b-chat-int8");
export type LlamaModels = z.infer<typeof LlamaModels>;

export const LlamaProvider = z.literal("llama");

export const LlamaChatParams = z.object({
	name: LlamaModels,
	params: ModelParams,
	serviceName: z.literal("LlamaService"),
	api: z.literal("llama"),
});
export type LlamaChatParams = z.infer<typeof LlamaChatParams>;
