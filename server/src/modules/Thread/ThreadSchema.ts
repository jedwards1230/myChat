import { Type, type Static } from "@sinclair/typebox";
import { AgentObjectSchema } from "../Agent/AgentSchema";
import { MessageSchema } from "../Message/MessageSchema";

export const ThreadSchema = Type.Object({
	id: Type.String(),
	created: Type.String(),
	lastModified: Type.String(),
	activeMessage: Type.Optional(MessageSchema),
	messages: Type.Optional(Type.Array(MessageSchema)),
	title: Type.Optional(Type.String()),
	agent: Type.Optional(AgentObjectSchema),
	version: Type.Optional(Type.Number()),
});
export type ThreadSchema = Static<typeof ThreadSchema>;

export const ThreadListSchema = Type.Array(ThreadSchema);
export type ThreadListSchema = Static<typeof ThreadListSchema>;
