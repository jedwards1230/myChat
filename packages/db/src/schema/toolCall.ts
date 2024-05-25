import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Message } from "./message";

export const FunctionCallSchema = z
	.object({
		arguments: z.string().optional(),
		name: z.string().optional(),
	})
	.nullable();
export type FunctionCall = z.infer<typeof FunctionCallSchema>;

export const ToolCallType = pgEnum("toolCall_type_enum", ["function"]);

export const ToolCall = pgTable("ToolCall", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	function: jsonb("function").$type<FunctionCall | null>(),
	content: text("content"),
	type: ToolCallType("type").default("function").notNull(),

	assistantMessageId: uuid("assistantMessageId").references(
		(): AnyPgColumn => Message.id,
	),
});

export const ToolCallSchema = createSelectSchema(ToolCall, {
	function: FunctionCallSchema,
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

export const CreateToolCallSchema = createInsertSchema(ToolCall, {
	function: FunctionCallSchema,
}).omit({
	id: true,
});
export type CreateToolCall = z.infer<typeof CreateToolCallSchema>;
