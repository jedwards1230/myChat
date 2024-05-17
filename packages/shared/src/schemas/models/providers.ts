import z from "zod";

import { LlamaChatParams, LlamaModels, LlamaProvider } from "./llama";
import { OpenAiChatParams, OpenAiModels, OpenAiProvider } from "./openai";

export const ChatModel = z.union([OpenAiModels, LlamaModels]);
export type ChatModel = z.infer<typeof ChatModel>;

export const ApiProviders = z.union([OpenAiProvider, LlamaProvider]);
export type ApiProviders = z.infer<typeof ApiProviders>;

export const ModelApi = z.union([OpenAiChatParams, LlamaChatParams]);
export type ModelApi = z.infer<typeof ModelApi>;

export const ModelListSchema = z.array(ModelApi);
export type ModelListSchema = z.infer<typeof ModelListSchema>;
