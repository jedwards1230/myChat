import { Type, type Static } from "@fastify/type-provider-typebox";
import { getListByApi, modelList } from "./data";

const OpenAiModelLiteral = Type.Union(
	getListByApi("openai").map((m) => Type.Literal(m.name))
);
export type OpenAiModelLiteral = Static<typeof OpenAiModelLiteral>;

const LlamaModelLiteral = Type.Literal("llama-2-7b-chat-int8");
export type LlamaModelLiteral = Static<typeof LlamaModelLiteral>;

export const ModelLiteral = Type.Union([OpenAiModelLiteral, LlamaModelLiteral]);
export type ModelLiteral = Static<typeof ModelLiteral>;

const ModelParams = Type.Object({
	temperature: Type.Optional(Type.Number()),
	topP: Type.Optional(Type.Number()),
	N: Type.Optional(Type.Number()),
	maxTokens: Type.Optional(Type.Number()),
	frequencyPenalty: Type.Optional(Type.Number()),
	presencePenalty: Type.Optional(Type.Number()),
	canStream: Type.Optional(Type.Boolean()),
});

const OpenAiApiInfo = Type.Object({
	name: OpenAiModelLiteral,
	api: Type.Literal("openai"),
});
export type OpenAiApiInfo = Static<typeof OpenAiApiInfo>;

const LlamaApiInfo = Type.Object({ name: LlamaModelLiteral, api: Type.Literal("llama") });
export type LlamaApiInfo = Static<typeof LlamaApiInfo>;

export const ModelInfoSchema = Type.Intersect([
	Type.Union([OpenAiApiInfo, LlamaApiInfo]),
	Type.Object({ params: ModelParams }),
]);
export type ModelInfoSchema = Static<typeof ModelInfoSchema>;

export const ModelListSchema = Type.Array(ModelInfoSchema);
export type ModelListSchema = Static<typeof ModelListSchema>;
