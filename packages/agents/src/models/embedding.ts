import type { OpenAiEmbeddingParams } from "@mychat/shared/schemas/models";

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

export const ModelMap = {
	"text-embedding-3-small": embedding3Small,
	"text-embedding-3-large": embedding3Large,
} as const;
export type ModelMap = typeof ModelMap;

export const modelList = Object.values(ModelMap) as OpenAiEmbeddingParams[];
