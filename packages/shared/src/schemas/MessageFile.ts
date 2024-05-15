import z from "zod";

export const MessageFileObjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	uploadDate: z.date(),
	mimetype: z.string(),
	extension: z.string(),
	size: z.number(),
	path: z.optional(z.string()),
	lastModified: z.union([z.number(), z.null()]),
	tokenCount: z.optional(z.number()),
	fileData: z.optional(z.any()),
	parsedText: z.optional(z.string()),
});
export type MessageFileObjectSchema = z.infer<typeof MessageFileObjectSchema>;

export const MessageFileSchemaWithoutId = MessageFileObjectSchema.omit({ id: true });
export type MessageFileSchemaWithoutId = z.infer<typeof MessageFileSchemaWithoutId>;

export const MessageFileListSchema = z.array(MessageFileObjectSchema);
export type MessageFileListSchema = z.infer<typeof MessageFileListSchema>;
