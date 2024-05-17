import type { LlamaChatParams, OpenAiChatParams } from "@mychat/shared/schemas/models";

/** The model used to generate responses */
export type ModelApi = OpenAiChatParams | LlamaChatParams;

export interface ChatFunction {
	name: string;
	parameters: Record<string, unknown>;
	description?: string;
}
