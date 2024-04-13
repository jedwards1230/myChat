import { Type, type Static } from "@sinclair/typebox";

export const UserSessionSchema = Type.Object({
	id: Type.String(),
	createdAt: Type.String(),
	lastActive: Type.Optional(Type.String()),
	userId: Type.String(),
	expire: Type.String(),
	provider: Type.Literal("email"),
});
export type UserSessionSchema = Static<typeof UserSessionSchema>;
