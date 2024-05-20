import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { DatabaseDocument } from "./document";
import { MessageFile } from "./messageFile";
import { ToolCall } from "./toolCall";

export const MessageRole = pgEnum("message_role_enum", [
	"system",
	"user",
	"assistant",
	"tool",
]);
export type MessageRole = (typeof MessageRole.enumValues)[number];

export const Message = pgTable("message", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	content: text("content"),
	role: MessageRole("role").notNull(),
	name: text("name"),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	tokenCount: integer("tokenCount").default(0).notNull(),

	toolCallIdId: text("toolCallIdId").references((): AnyPgColumn => ToolCall.id),
});

export const MessageRelations = relations(Message, ({ one, many }) => ({
	documents: many(DatabaseDocument),
	toolCalls: many(ToolCall),
	toolCall: one(ToolCall, {
		fields: [Message.toolCallIdId],
		references: [ToolCall.id],
	}),
	files: many(MessageFile),
}));

export const InsertMessageSchema = createInsertSchema(Message);
export type InsertMessage = z.infer<typeof InsertMessageSchema>;

export const SelectMessageSchema = createSelectSchema(Message);
export type SelectMessage = z.infer<typeof SelectMessageSchema>;

export const MessageClosure = pgTable(
	"message_closure",
	{
		id_ancestor: uuid("id_ancestor")
			.notNull()
			.references(() => Message.id, { onDelete: "cascade" }),
		id_descendant: uuid("id_descendant")
			.notNull()
			.references(() => Message.id, { onDelete: "cascade" }),
	},
	(table) => {
		return {
			parentIdx: index("parent_idx").on(table.id_ancestor),
			childIdx: index("child_idx").on(table.id_descendant),
			pk: primaryKey({ columns: [table.id_ancestor, table.id_descendant] }),
		};
	},
);

export const MessageClosureRelations = relations(MessageClosure, ({ one }) => ({
	parent: one(Message, {
		fields: [MessageClosure.id_ancestor],
		references: [Message.id],
	}),
	child: one(Message, {
		fields: [MessageClosure.id_descendant],
		references: [Message.id],
	}),
}));
