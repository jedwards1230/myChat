import { Type, type Static } from "@fastify/type-provider-typebox";

import { AgentObjectSchema } from "../Agent/AgentSchema";
import { MessageObjectSchema } from "../Message/MessageSchema";

export const ThreadSchema = Type.Object({
	id: Type.String(),
	created: Type.String(),
	lastModified: Type.String(),
	activeMessage: Type.Optional(MessageObjectSchema),
	messages: Type.Optional(Type.Array(MessageObjectSchema)),
	title: Type.Optional(Type.String()),
	agent: Type.Optional(AgentObjectSchema),
	version: Type.Optional(Type.Number()),
});
export type ThreadSchema = Static<typeof ThreadSchema>;

export const ThreadSchemaWithoutId = Type.Omit(ThreadSchema, ["id"]);
export type ThreadSchemaWithoutId = Static<typeof ThreadSchemaWithoutId>;

export const ThreadListSchema = Type.Array(ThreadSchema);
export type ThreadListSchema = Static<typeof ThreadListSchema>;
