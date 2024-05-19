import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Agent } from "./agent";
import { AgentRun } from "./agentRun";
import { DatabaseDocument } from "./document";
import { Message } from "./message";
import { User } from "./user";

export const Thread = pgTable(
	"Thread",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		created: timestamp("created", { mode: "string" }).defaultNow().notNull(),
		lastModified: timestamp("lastModified", { mode: "string" })
			.defaultNow()
			.notNull(),
		title: text("title"),
		version: integer("version").notNull(),
		activeMessageId: uuid("activeMessageId").references(
			(): AnyPgColumn => Message.id,
		),
		agentId: uuid("agentId").references(() => Agent.id),
		userId: uuid("userId").references(() => User.id),
	},
	(table) => {
		return {
			REL_e890a2d3645547f7bf2e204d63: unique("REL_e890a2d3645547f7bf2e204d63").on(
				table.activeMessageId,
			),
		};
	},
);

export const InsertThreadSchema = createInsertSchema(Thread);
export type InsertThread = z.infer<typeof InsertThreadSchema>;

export const SelectThreadSchema = createSelectSchema(Thread);
export type SelectThread = z.infer<typeof SelectThreadSchema>;

export const ThreadRelations = relations(Thread, ({ one, many }) => ({
	Message: one(Message, {
		fields: [Thread.activeMessageId],
		references: [Message.id],
		relationName: "Thread_activeMessageId_Message_id",
	}),
	Agent: one(Agent, {
		fields: [Thread.agentId],
		references: [Agent.id],
	}),
	User: one(User, {
		fields: [Thread.userId],
		references: [User.id],
	}),
	documents: many(DatabaseDocument),
	Messages: many(Message, {
		relationName: "Message_threadId_Thread_id",
	}),
	AgentRuns: many(AgentRun),
}));
