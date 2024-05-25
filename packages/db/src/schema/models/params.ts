import z from "zod";

export const ChatModelParams = z.object({
	maxTokens: z.number(),
	temperature: z.optional(z.number()),
	topP: z.optional(z.number()),
	N: z.optional(z.number()),
	frequencyPenalty: z.optional(z.number()),
	presencePenalty: z.optional(z.number()),
	canStream: z.optional(z.boolean()),
});
export type ChatModelParams = z.infer<typeof ChatModelParams>;

export const EmbeddingModelParams = z.object({
	maxTokens: z.number(),
	dimensions: z.number(),
});
export type EmbeddingModelParams = z.infer<typeof EmbeddingModelParams>;

export const ModelParams = z.union([ChatModelParams, EmbeddingModelParams]);
export type ModelParams = z.infer<typeof ModelParams>;
