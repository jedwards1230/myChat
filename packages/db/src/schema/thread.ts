import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Agent } from "./agent";
import { AgentRun } from "./agentRun";
import { DatabaseDocument } from "./document";
import { Message } from "./message";
import { User } from "./user";

export const Thread = pgTable("thread", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	created: timestamp("created", { mode: "string" }).defaultNow().notNull(),
	lastModified: timestamp("lastModified", { mode: "string" }).defaultNow().notNull(),
	title: text("title"),

	activeMessageId: uuid("activeMessageId").references((): AnyPgColumn => Message.id),
	agentId: uuid("agentId").references(() => Agent.id),
	userId: uuid("userId").references(() => User.id),
});

export const ThreadSchema = createSelectSchema(Thread);
export type Thread = z.infer<typeof ThreadSchema>;

export const CreateThreadSchema = createInsertSchema(Thread).omit({
	id: true,
	created: true,
	lastModified: true,
	activeMessageId: true,
});
export type CreateThread = z.infer<typeof CreateThreadSchema>;

export const ThreadRelations = relations(Thread, ({ one, many }) => ({
	activeMessage: one(Message, {
		fields: [Thread.activeMessageId],
		references: [Message.id],
	}),
	agent: one(Agent, {
		fields: [Thread.agentId],
		references: [Agent.id],
	}),
	user: one(User, {
		fields: [Thread.userId],
		references: [User.id],
	}),
	files: many(DatabaseDocument),
	messages: many(Message),
	agentRuns: many(AgentRun),
}));
