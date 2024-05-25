import type { ApiProviders, ModelApi } from "./providers";

export * from "./llama";
export * from "./openai";
export * from "./providers";
export * from "./params";

export function isProvider<T extends ApiProviders>(
	api: T,
	model: ModelApi,
): model is Extract<ModelApi, { api: T }> {
	return model.api === api;
}

type SpecificModelApi<T extends ApiProviders> = Extract<ModelApi, { api: T }>;

/** Get list of models. Includes type narrowing by provider. */
export function getListByApi<T extends ApiProviders>(
	api: T,
	modelList: ModelApi[],
): SpecificModelApi<T>[] {
	return modelList.filter((model): model is SpecificModelApi<T> =>
		isProvider(api, model),
	);
}
