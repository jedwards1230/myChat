import { Type, type Static } from "@sinclair/typebox";

export const MessageSchema = Type.Object({
	id: Type.String(),
	content: Type.Optional(Type.String()),
	role: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
	createdAt: Type.String(),
	tool_calls: Type.Optional(Type.Array(Type.Any())),
	tool_call_id: Type.Optional(Type.Any()),
	files: Type.Optional(Type.Array(Type.Any())),
	version: Type.Optional(Type.Number()),
});
export type MessageSchema = Static<typeof MessageSchema>;

export const MessageSchemaWithoutId = Type.Omit(MessageSchema, ["id"]);
export type MessageSchemaWithoutId = Static<typeof MessageSchemaWithoutId>;

export const MessageListSchema = Type.Array(MessageSchema);
export type MessageListSchema = Static<typeof MessageListSchema>;
