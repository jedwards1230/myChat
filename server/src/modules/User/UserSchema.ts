import { Type, type Static } from "@sinclair/typebox";
import { ThreadSchema } from "../Thread/ThreadSchema";
import { AgentObjectSchema } from "../Agent/AgentSchema";

export const UserSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	threads: Type.Optional(Type.Array(ThreadSchema)),
	agents: Type.Optional(Type.Array(AgentObjectSchema)),
	defaultAgent: Type.Optional(AgentObjectSchema),
	sessions: Type.Optional(Type.Array(Type.String())),
});
export type UserSchema = Static<typeof UserSchema>;
