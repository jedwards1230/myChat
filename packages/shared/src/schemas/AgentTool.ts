import z from "zod";
import { ToolNames } from "../tools/index";
import { constructZodLiteralUnionType } from "../lib/zod";

export const AgentToolsNameSchema = constructZodLiteralUnionType(ToolNames);
export type AgentToolsNameSchema = z.infer<typeof AgentToolsNameSchema>;

export const AgentToolSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	name: z.string(),
	enabled: z.boolean(),
	description: z.string(),
	parameters: z.object({}),
	toolName: AgentToolsNameSchema,
	parse: z.string(),
	version: z.number(),
});
export type AgentToolSchema = z.infer<typeof AgentToolSchema>;

export const AgentToolCreateSchema = AgentToolSchema.omit({
	id: true,
	createdAt: true,
	version: true,
});
export type AgentToolCreateSchema = z.infer<typeof AgentToolCreateSchema>;

export const AgentToolUpdateSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("name"), value: z.string() }),
	z.object({ type: z.literal("enabled"), value: z.boolean() }),
	z.object({ type: z.literal("description"), value: z.string() }),
	z.object({ type: z.literal("parameters"), value: z.any() }),
	z.object({ type: z.literal("toolName"), value: AgentToolsNameSchema }),
]);
export type AgentToolUpdateSchema = z.infer<typeof AgentToolUpdateSchema>;
