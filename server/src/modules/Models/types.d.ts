type GPT3 = "gpt-3.5-turbo-1106" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k";
type GPT4 =
	| "gpt-4-turbo"
	//| "gpt-4-turbo-2024-04-09"
	//| "gpt-4-turbo-preview"
	//| "gpt-4-0125-preview"
	//| "gpt-4-1106-preview"
	| "gpt-4-vision-preview"
	//| "gpt-4-1106-vision-preview"
	| "gpt-4"
	| "gpt-4-0613";

type OpenAiModels = GPT3 | GPT4;
type LlamaModels = "llama-2-7b-chat-int8";

type Model = OpenAiModels | LlamaModels;

type ApiProvider = "openai" | "llama";

type ModelParams = {
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
	api: ApiProvider;
	params: ModelParams;
}

interface OpenAiModelInfo extends ModelInfo {
	name: OpenAiModels;
	api: "openai";
}

interface LlamaModelInfo extends ModelInfo {
	name: LlamaModels;
	api: "llama";
}

/** The model used to generate responses */
type ModelApi = OpenAiModelInfo | LlamaModelInfo;

interface ChatFunction {
	name: string;
	parameters: Record<string, unknown>;
	description?: string;
}
