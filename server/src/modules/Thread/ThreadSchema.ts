import z from "zod";

import { AgentObjectSchema } from "../Agent/AgentSchema";
import { MessageObjectSchema } from "../Message/MessageSchema";

export const ThreadSchema = z.object({
	id: z.string(),
	created: z.date(),
	lastModified: z.date(),
	activeMessage: z.optional(MessageObjectSchema),
	messages: z.optional(z.array(MessageObjectSchema)),
	title: z.union([z.string(), z.null()]),
	agent: z.optional(AgentObjectSchema),
	version: z.optional(z.number()),
});
export type ThreadSchema = z.infer<typeof ThreadSchema>;

export const ThreadSchemaWithoutId = ThreadSchema.omit({ id: true });
export type ThreadSchemaWithoutId = z.infer<typeof ThreadSchemaWithoutId>;

export const ThreadListSchema = z.array(ThreadSchema);
export type ThreadListSchema = z.infer<typeof ThreadListSchema>;
