import z from "zod";

export const AgentObjectSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	name: z.string(),
	tools: z.array(z.string()),
	toolsEnabled: z.boolean(),
	systemMessage: z.string(),
	threads: z.optional(z.array(z.string())),
	owner: z.optional(z.string()),
	version: z.optional(z.number()),
});
export type AgentObjectSchema = z.infer<typeof AgentObjectSchema>;

export const AgentObjectListSchema = z.array(AgentObjectSchema);
export type AgentObjectListSchema = z.infer<typeof AgentObjectListSchema>;

export const AgentCreateSchema = AgentObjectSchema.omit({
	id: true,
	createdAt: true,
	threads: true,
	owner: true,
	version: true,
});
export type AgentCreateSchema = z.infer<typeof AgentCreateSchema>;
