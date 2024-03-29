import { Type, type Static } from "@fastify/type-provider-typebox";
import { MessageFileListSchema } from "../File";

export const MessageObjectSchema = Type.Object({
	id: Type.String(),
	content: Type.Optional(Type.String()),
	role: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
	createdAt: Type.String(),
	tool_calls: Type.Optional(Type.Array(Type.Any())),
	tool_call_id: Type.Optional(Type.Any()),
	files: Type.Optional(MessageFileListSchema),
	version: Type.Optional(Type.Number()),
});
export type MessageObjectSchema = Static<typeof MessageObjectSchema>;

export const MessageSchemaWithoutId = Type.Omit(MessageObjectSchema, ["id"]);
export type MessageSchemaWithoutId = Static<typeof MessageSchemaWithoutId>;

export const MessageCreateSchema = Type.Object({
	content: Type.Optional(Type.String()),
	role: Type.Optional(Type.String()),
});
export type MessageCreateSchema = Static<typeof MessageCreateSchema>;

export const MessageListSchema = Type.Array(MessageObjectSchema);
export type MessageListSchema = Static<typeof MessageListSchema>;
