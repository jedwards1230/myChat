import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Message } from "./message";

export const ToolCallType = pgEnum("toolCall_type_enum", ["function"]);

export const ToolCall = pgTable("ToolCall", {
	id: text("id").primaryKey().notNull(),
	function: jsonb("function"),
	content: text("content"),
	type: ToolCallType("type").default("function").notNull(),
	version: integer("version").notNull(),
	assistantMessageId: uuid("assistantMessageId").references(
		(): AnyPgColumn => Message.id,
	),
});

export const InsertToolCallSchema = createInsertSchema(ToolCall);
export type InsertToolCall = z.infer<typeof InsertToolCallSchema>;

export const SelectToolCallSchema = createSelectSchema(ToolCall);
export type SelectToolCall = z.infer<typeof SelectToolCallSchema>;

export const ToolCallRelations = relations(ToolCall, ({ one, many }) => ({
	Messages: many(Message, {
		relationName: "Message_toolCallIdId_ToolCall_id",
	}),
	Message: one(Message, {
		fields: [ToolCall.assistantMessageId],
		references: [Message.id],
		relationName: "ToolCall_assistantMessageId_Message_id",
	}),
}));
