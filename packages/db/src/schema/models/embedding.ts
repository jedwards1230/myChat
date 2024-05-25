import type { OpenAiEmbeddingParams } from ".";

const embedding3Small: OpenAiEmbeddingParams = {
	name: "text-embedding-3-small",
	serviceName: "OpenAIService",
	api: "openai",
	params: {
		maxTokens: 8196,
		dimensions: 1536,
	},
};

const embedding3Large: OpenAiEmbeddingParams = {
	name: "text-embedding-3-large",
	serviceName: "OpenAIService",
	api: "openai",
	params: {
		maxTokens: 8196,
		dimensions: 3072,
	},
};

export const EmbeddingModelMap = {
	"text-embedding-3-small": embedding3Small,
	"text-embedding-3-large": embedding3Large,
} as const;
export type EmbeddingModelMap = typeof EmbeddingModelMap;

export const modelList = Object.values(EmbeddingModelMap);
