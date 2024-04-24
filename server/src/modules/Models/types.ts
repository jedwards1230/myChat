const GPT3 = ["gpt-3.5-turbo-1106", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"] as const;
type GPT3 = (typeof GPT3)[number];
const GPT4 = ["gpt-4-turbo", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613"] as const;
type GPT4 = (typeof GPT4)[number];

export const OpenAiModels = [...GPT3, ...GPT4] as const;
export type OpenAiModels = (typeof OpenAiModels)[number];

export const LlamaModels = ["llama-2-7b-chat-int8"] as const;
export type LlamaModels = (typeof LlamaModels)[number];

export type Model = OpenAiModels | LlamaModels;

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
    api: ApiProviders;
    params: ModelParams;
}

export interface OpenAiModelInfo extends ModelInfo {
    name: OpenAiModels;
    api: "openai";
}

export interface LlamaModelInfo extends ModelInfo {
    name: LlamaModels;
    api: "llama";
}

/** The model used to generate responses */
export type ModelApi = OpenAiModelInfo | LlamaModelInfo;

export interface ChatFunction {
    name: string;
    parameters: Record<string, unknown>;
    description?: string;
}
