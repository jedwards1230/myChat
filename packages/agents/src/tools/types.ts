import type { AbstractChatCompletionRunner } from "openai/lib/AbstractChatCompletionRunner.mjs";
import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";

export type Runner<T extends string | object> = RunnableToolFunction<T>;

export interface LLMTool<T extends string | object> {
	tool: (props: T, runner: AbstractChatCompletionRunner) => Promise<string>;
	runnable: Runner<T>;
}

export type Runnable<T> = T extends (infer U)[]
	? U extends { runnable: infer R }
		? R
		: never
	: T extends { runnable: infer R }
		? R
		: never;

export interface ToolConfig<T = LLMTool<any>[]> {
	name: string;
	tools: T;
	description: string;
	systemMessage: string;
	getTools: () => Runnable<T>[];
}
