import { Type, type Static } from "@fastify/type-provider-typebox";

export const AgentObjectSchema = Type.Object({
	id: Type.String(),
	createdAt: Type.String(),
	name: Type.String(),
	tools: Type.Array(Type.String()),
	toolsEnabled: Type.Boolean(),
	systemMessage: Type.String(),
	threads: Type.Optional(Type.Array(Type.String())),
	owner: Type.Optional(Type.String()),
	version: Type.Optional(Type.Number()),
});
export type AgentObjectSchema = Static<typeof AgentObjectSchema>;

export const AgentObjectListSchema = Type.Array(AgentObjectSchema);
export type AgentObjectListSchema = Static<typeof AgentObjectListSchema>;

export const AgentCreateSchema = Type.Omit(AgentObjectSchema, [
	"id",
	"createdAt",
	"threads",
	"owner",
	"version",
]);
export type AgentCreateSchema = Static<typeof AgentCreateSchema>;
