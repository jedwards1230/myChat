import z from "zod";
import { ToolNames } from "../LLMNexus/Tools";

export const AgentToolsSchema = z.enum([ToolNames[0], ...ToolNames]);
export type AgentToolsSchema = z.infer<typeof AgentToolsSchema>;

export const AgentObjectSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	name: z.string(),
	tools: z.array(AgentToolsSchema),
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

// Discriminated union schema options
export const AgentUpdateSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("name"), value: z.string() }),
	z.object({ type: z.literal("tools"), value: z.array(z.string()) }),
	z.object({ type: z.literal("toolsEnabled"), value: z.boolean() }),
	z.object({ type: z.literal("systemMessage"), value: z.string() }),
]);
export type AgentUpdateSchema = z.infer<typeof AgentUpdateSchema>;
