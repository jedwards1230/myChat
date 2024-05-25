import type { LlamaChatParams } from "./llama";
import type { OpenAiChatParams } from "./openai";
import type { ModelParams } from "./params";

const gpt4TurboParams: ModelParams = {
	temperature: 0.7,
	topP: 1,
	N: 1,
	maxTokens: 128000,
	frequencyPenalty: 0,
	presencePenalty: 0,
};
const gpt4Omni: OpenAiChatParams = {
	name: "gpt-4o",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt4TurboParams,
};
const gpt4Turbo: OpenAiChatParams = {
	name: "gpt-4-turbo",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt4TurboParams,
};
const gpt4Vision: OpenAiChatParams = {
	name: "gpt-4-vision-preview",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt4TurboParams,
};

const gpt4Params: ModelParams = {
	temperature: 0.7,
	topP: 1,
	N: 1,
	maxTokens: 8192,
	frequencyPenalty: 0,
	presencePenalty: 0,
};
const gpt4: OpenAiChatParams = {
	name: "gpt-4",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt4Params,
};
const gpt4_0613: OpenAiChatParams = {
	name: "gpt-4-0613",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt4Params,
};

const gpt35TurboParams: ModelParams = {
	temperature: 0.7,
	topP: 1,
	N: 1,
	maxTokens: 16385,
	frequencyPenalty: 0,
	presencePenalty: 0,
};
const gpt35TurboBeta: OpenAiChatParams = {
	name: "gpt-3.5-turbo-1106",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt35TurboParams,
};
const gpt35Turbo: OpenAiChatParams = {
	name: "gpt-3.5-turbo",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt35TurboParams,
};
const gpt35Turbo16k: OpenAiChatParams = {
	name: "gpt-3.5-turbo-16k",
	serviceName: "OpenAIService",
	api: "openai",
	params: gpt35TurboParams,
};

const llama2: LlamaChatParams = {
	name: "llama-2-7b-chat-int8",
	serviceName: "LlamaService",
	api: "llama",
	params: {
		temperature: 0.7,
		topP: 1,
		N: 1,
		maxTokens: 4000,
		frequencyPenalty: 0,
		presencePenalty: 0,
	},
};

export const ChatModelMap = {
	"gpt-4o": gpt4Omni,
	"gpt-4-turbo": gpt4Turbo,
	"gpt-4-vision-preview": gpt4Vision,
	"gpt-4": gpt4,
	"gpt-4-0613": gpt4_0613,
	"gpt-3.5-turbo-1106": gpt35TurboBeta,
	"gpt-3.5-turbo": gpt35Turbo,
	"gpt-3.5-turbo-16k": gpt35Turbo16k,
	"llama-2-7b-chat-int8": llama2,
} as const;
export type ChatModelMap = typeof ChatModelMap;

export const modelList = Object.values(ChatModelMap);
