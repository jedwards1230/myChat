import type { z } from "zod";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { vector } from "pgvector/drizzle-orm";

import { AgentRun } from "./agentRun";
import { Message } from "./message";
import { Thread } from "./thread";
import { User } from "./user";

export const DatabaseDocument = pgTable("db_document", {
	id: serial("id").primaryKey().notNull(),
	decoded: text("decoded").notNull(),
	metadata: jsonb("metadata").notNull(),
	tokenCount: integer("tokenCount").notNull(),

	threadId: uuid("threadId").references(() => Thread.id),
	userId: uuid("userId").references(() => User.id),
	messageId: uuid("messageId").references(() => Message.id),
});

export const documentRelations = relations(DatabaseDocument, ({ one, many }) => ({
	thread: one(Thread, {
		fields: [DatabaseDocument.threadId],
		references: [Thread.id],
	}),
	user: one(User, {
		fields: [DatabaseDocument.userId],
		references: [User.id],
	}),
	message: one(Message, {
		fields: [DatabaseDocument.messageId],
		references: [Message.id],
	}),
	agentRuns: many(AgentRun),
	embeddings: many(EmbedItem),
}));

export const CreateDatabaseDocumentSchema = createInsertSchema(DatabaseDocument).omit({
	id: true,
});
export type CreateDatabaseDocument = z.infer<typeof CreateDatabaseDocumentSchema>;

export const DatabaseDocumentSchema = createSelectSchema(DatabaseDocument);
export type DatabaseDocument = z.infer<typeof DatabaseDocumentSchema>;

export const EmbedItem = pgTable("embed_item", {
	id: serial("id").primaryKey().notNull(),
	embedding: vector("embedding", { dimensions: 1536 }).notNull(),
});

export const InsertEmbedItemSchema = createInsertSchema(EmbedItem);
export type InsertEmbedItem = z.infer<typeof InsertEmbedItemSchema>;

export const SelectEmbedItemSchema = createSelectSchema(EmbedItem);
export type SelectEmbedItem = z.infer<typeof SelectEmbedItemSchema>;
