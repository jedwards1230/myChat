import type { LlamaModels, Model, OpenAiModels } from "@mychat/shared/schemas/Models";

export const ApiProviders = ["openai", "llama"] as const;
export type ApiProviders = (typeof ApiProviders)[number];

export type ModelParams = {
	temperature?: number;
	topP?: number;
	N?: number;
	maxTokens?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
	canStream?: boolean;
};

/** Basic details for calling the API */
interface ModelInfo {
	name: Model;
	serviceName: string;
	api: ApiProviders;
	params: ModelParams;
}

export interface OpenAiModelInfo extends ModelInfo {
	name: OpenAiModels;
	serviceName: "OpenAIService";
	api: "openai";
}

export interface LlamaModelInfo extends ModelInfo {
	name: LlamaModels;
	serviceName: "LlamaService";
	api: "llama";
}

/** The model used to generate responses */
export type ModelApi = OpenAiModelInfo | LlamaModelInfo;

export interface ChatFunction {
	name: string;
	parameters: Record<string, unknown>;
	description?: string;
}
