import { Type, type Static } from "@fastify/type-provider-typebox";

import { ThreadSchema } from "../Thread/ThreadSchema";
import { AgentObjectSchema } from "../Agent/AgentSchema";

export const CreateUserSchema = Type.Object({
	email: Type.String(),
	password: Type.String(),
});
export type CreateUserSchema = Static<typeof CreateUserSchema>;

export const UserSchema = Type.Object({
	id: Type.String(),
	apiKey: Type.String(),
	name: Type.String(),
	threads: Type.Optional(Type.Array(ThreadSchema)),
	agents: Type.Optional(Type.Array(AgentObjectSchema)),
	defaultAgent: AgentObjectSchema,
	sessions: Type.Optional(Type.Array(Type.String())),
});
export type UserSchema = Static<typeof UserSchema>;
