import { Type, type Static } from "@fastify/type-provider-typebox";

import { ThreadSchema } from "../Thread";
import { AgentObjectSchema } from "../Agent";

export const UserSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	threads: Type.Optional(Type.Array(ThreadSchema)),
	agents: Type.Optional(Type.Array(AgentObjectSchema)),
	defaultAgent: AgentObjectSchema,
	sessions: Type.Optional(Type.Array(Type.String())),
});
export type UserSchema = Static<typeof UserSchema>;
