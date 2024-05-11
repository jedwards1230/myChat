import z from "zod";

import { AgentObjectSchema } from "./Agent";
import { MessageObjectSchema } from "./Message";

export const ThreadSchema = z.object({
	id: z.string(),
	created: z.date(),
	lastModified: z.date(),
	activeMessage: z.optional(MessageObjectSchema),
	messages: z.optional(z.array(MessageObjectSchema)),
	title: z.union([z.string(), z.null()]),
	agent: z.optional(AgentObjectSchema),
});
export type ThreadSchema = z.infer<typeof ThreadSchema>;

export const ThreadSchemaWithoutId = ThreadSchema.omit({ id: true });
export type ThreadSchemaWithoutId = z.infer<typeof ThreadSchemaWithoutId>;

export const ThreadListSchema = z.array(ThreadSchema);
export type ThreadListSchema = z.infer<typeof ThreadListSchema>;

// schema to allow partial patching of thread object
export const ThreadPatchSchema = z.object({
	title: z.string().optional(),
	activeMessage: z.string().optional(),
});
export type ThreadPatchSchema = z.infer<typeof ThreadPatchSchema>;
