import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { DatabaseDocument } from "./document";
import { MessageFile } from "./messageFile";
import { Thread } from "./thread";
import { ToolCall } from "./toolCall";

export const MessageRole = pgEnum("message_role_enum", [
	"system",
	"user",
	"assistant",
	"tool",
]);
export type MessageRole = (typeof MessageRole.enumValues)[number];

export const Message = pgTable(
	"Message",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		content: text("content"),
		role: MessageRole("role").notNull(),
		name: text("name"),
		createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
		tokenCount: integer("tokenCount").default(0).notNull(),
		threadId: uuid("threadId").references((): AnyPgColumn => Thread.id, {
			onDelete: "cascade",
		}),
		toolCallIdId: text("toolCallIdId").references((): AnyPgColumn => ToolCall.id),
		parentId: uuid("parentId"),
	},
	(table) => {
		return {
			FK_46dd2ddc370017214fef302ca8f: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: "FK_46dd2ddc370017214fef302ca8f",
			}),
			REL_8b38a933c77f4398908d09febe: unique("REL_8b38a933c77f4398908d09febe").on(
				table.toolCallIdId,
			),
		};
	},
);

export const InsertMessageSchema = createInsertSchema(Message);
export type InsertMessage = z.infer<typeof InsertMessageSchema>;

export const SelectMessageSchema = createSelectSchema(Message);
export type SelectMessage = z.infer<typeof SelectMessageSchema>;

export const Message_closure = pgTable(
	"Message_closure",
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
			IDX_941ea848f09d43306b75ea9791: index("IDX_941ea848f09d43306b75ea9791").on(
				table.id_ancestor,
			),
			IDX_090362f69add0ffff1dcc98539: index("IDX_090362f69add0ffff1dcc98539").on(
				table.id_descendant,
			),
			PK_883bac06f134fb892a0a01d72c0: primaryKey({
				columns: [table.id_ancestor, table.id_descendant],
				name: "PK_883bac06f134fb892a0a01d72c0",
			}),
		};
	},
);

export const MessageRelations = relations(Message, ({ one, many }) => ({
	Threads: many(Thread, {
		relationName: "Thread_activeMessageId_Message_id",
	}),
	documents: many(DatabaseDocument),
	Thread: one(Thread, {
		fields: [Message.threadId],
		references: [Thread.id],
		relationName: "Message_threadId_Thread_id",
	}),
	ToolCall: one(ToolCall, {
		fields: [Message.toolCallIdId],
		references: [ToolCall.id],
		relationName: "Message_toolCallIdId_ToolCall_id",
	}),
	Message: one(Message, {
		fields: [Message.parentId],
		references: [Message.id],
		relationName: "Message_parentId_Message_id",
	}),
	Messages: many(Message, {
		relationName: "Message_parentId_Message_id",
	}),
	MessageFiles: many(MessageFile),
	ToolCalls: many(ToolCall, {
		relationName: "ToolCall_assistantMessageId_Message_id",
	}),
	Message_closures_id_ancestor: many(Message_closure, {
		relationName: "Message_closure_id_ancestor_Message_id",
	}),
	Message_closures_id_descendant: many(Message_closure, {
		relationName: "Message_closure_id_descendant_Message_id",
	}),
}));

export const Message_closureRelations = relations(Message_closure, ({ one }) => ({
	Message_id_ancestor: one(Message, {
		fields: [Message_closure.id_ancestor],
		references: [Message.id],
		relationName: "Message_closure_id_ancestor_Message_id",
	}),
	Message_id_descendant: one(Message, {
		fields: [Message_closure.id_descendant],
		references: [Message.id],
		relationName: "Message_closure_id_descendant_Message_id",
	}),
}));
