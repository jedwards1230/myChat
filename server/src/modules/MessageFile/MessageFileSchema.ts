import { Type, type Static } from "@fastify/type-provider-typebox";

export const MessageFileObjectSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	uploadDate: Type.String(),
	mimetype: Type.String(),
	extension: Type.String(),
	size: Type.Number(),
	path: Type.Optional(Type.String()),
	lastModified: Type.Optional(Type.Number()),
	tokenCount: Type.Optional(Type.Number()),
	fileData: Type.Optional(Type.Any()),
	parsable: Type.Optional(Type.Boolean()),
});
export type MessageFileObjectSchema = Static<typeof MessageFileObjectSchema>;

export const MessageFileSchemaWithoutId = Type.Omit(MessageFileObjectSchema, ["id"]);
export type MessageFileSchemaWithoutId = Static<typeof MessageFileSchemaWithoutId>;

export const MessageFileListSchema = Type.Array(MessageFileObjectSchema);
export type MessageFileListSchema = Static<typeof MessageFileListSchema>;
