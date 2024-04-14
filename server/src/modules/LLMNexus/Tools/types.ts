import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";
import type { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";

export type Runner<T extends string | object> = RunnableToolFunction<T>;

export type LLMTool<T extends string | object> = {
	tool: (
		props: T,
		runner: ChatCompletionRunner | ChatCompletionStreamingRunner
	) => Promise<string>;
	runnable: Runner<T>;
};
