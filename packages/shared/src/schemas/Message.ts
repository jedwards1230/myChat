import z from "zod";
import { MessageFileListSchema } from "./MessageFile";

export type Role = "system" | "user" | "assistant" | "tool";

export enum RoleEnum {
	System = "system",
	User = "user",
	Assistant = "assistant",
	Tool = "tool",
}

export const roleList: Role[] = ["system", "user", "assistant", "tool"];

export const MessageObjectSchema = z.object({
	id: z.string(),
	role: z.nativeEnum(RoleEnum),
	createdAt: z.date(),
	tokenCount: z.number(),
	name: z.union([z.string(), z.null()]),
	content: z.optional(z.string()),
	tool_call_id: z.optional(z.any()),
	tool_calls: z.optional(z.array(z.any())),
	files: z.optional(MessageFileListSchema),
});
export type MessageObjectSchema = z.infer<typeof MessageObjectSchema>;

export const MessageSchemaWithoutId = MessageObjectSchema.omit({ id: true });
export type MessageSchemaWithoutId = z.infer<typeof MessageSchemaWithoutId>;

export const MessageCreateSchema = z.object({
	content: z.optional(z.string()),
	role: z.optional(z.string()),
});
export type MessageCreateSchema = z.infer<typeof MessageCreateSchema>;

export const MessageUpdateSchema = z.object({
	id: z.string(),
	content: z.optional(z.string()),
});
export type MessageUpdateSchema = z.infer<typeof MessageUpdateSchema>;

export const MessageListSchema = z.array(MessageObjectSchema);
export type MessageListSchema = z.infer<typeof MessageListSchema>;
