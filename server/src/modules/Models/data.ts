const gpt4TurboParams: ModelParams = {
	temperature: 0.7,
	topP: 1,
	N: 1,
	maxTokens: 128000,
	frequencyPenalty: 0,
	presencePenalty: 0,
};
const gpt4Turbo: OpenAiModelInfo = {
	name: "gpt-4-turbo",
	api: "openai",
	params: gpt4TurboParams,
};
const gpt4Vision: OpenAiModelInfo = {
	name: "gpt-4-vision-preview",
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
const gpt4: OpenAiModelInfo = {
	name: "gpt-4",
	api: "openai",
	params: gpt4Params,
};
const gpt4_0613: OpenAiModelInfo = {
	name: "gpt-4-0613",
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
const gpt35TurboBeta: OpenAiModelInfo = {
	name: "gpt-3.5-turbo-1106",
	api: "openai",
	params: gpt35TurboParams,
};
const gpt35Turbo: OpenAiModelInfo = {
	name: "gpt-3.5-turbo",
	api: "openai",
	params: gpt35TurboParams,
};
const gpt35Turbo16k: OpenAiModelInfo = {
	name: "gpt-3.5-turbo-16k",
	api: "openai",
	params: gpt35TurboParams,
};

const llama2: LlamaModelInfo = {
	name: "llama-2-7b-chat-int8",
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

export const modelMap: Record<Model, ModelApi> = {
	"gpt-4-turbo": gpt4Turbo,
	"gpt-4-vision-preview": gpt4Vision,
	"gpt-4": gpt4,
	"gpt-4-0613": gpt4_0613,
	"gpt-3.5-turbo-1106": gpt35TurboBeta,
	"gpt-3.5-turbo": gpt35Turbo,
	"gpt-3.5-turbo-16k": gpt35Turbo16k,
	"llama-2-7b-chat-int8": llama2,
};

export const modelList = Object.values(modelMap);

function isProvider<T extends ApiProvider>(
	api: T,
	model: ModelApi
): model is Extract<ModelApi, { api: T }> {
	return model.api === api;
}

type SpecificModelApi<T extends ApiProvider> = Extract<ModelApi, { api: T }>;

/** Get list of models. Includes type narrowing by provider. */
export function getListByApi<T extends ApiProvider>(api: T): SpecificModelApi<T>[] {
	return modelList.filter((model): model is SpecificModelApi<T> =>
		isProvider(api, model)
	);
}
