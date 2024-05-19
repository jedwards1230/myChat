import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Agent } from "./agent";
import { DatabaseDocument } from "./document";
import { Thread } from "./thread";

export type RunType = "getChat" | "getTitle";

export type AgentRunStatus =
	| "queued"
	| "in_progress"
	| "requires_action"
	| "cancelling"
	| "cancelled"
	| "failed"
	| "completed"
	| "expired";

export const statusList: AgentRunStatus[] = [
	"queued",
	"in_progress",
	"requires_action",
	"cancelling",
	"cancelled",
	"failed",
	"completed",
	"expired",
];

export const AgentRun = pgTable("AgentRun", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	model: jsonb("model").notNull(),
	status: text("status").default("queued").notNull(),
	type: text("type").notNull(),
	stream: boolean("stream").default(true).notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	threadId: uuid("threadId").references(() => Thread.id, { onDelete: "cascade" }),
	agentId: uuid("agentId").references(() => Agent.id),
	filesId: integer("filesId").references(() => DatabaseDocument.id),
});

export const InsertAgentRunSchema = createInsertSchema(AgentRun);
export type InsertAgentRun = z.infer<typeof InsertAgentRunSchema>;

export const SelectAgentRunSchema = createSelectSchema(AgentRun);
export type SelectAgentRun = z.infer<typeof SelectAgentRunSchema>;

export const AgentRunRelations = relations(AgentRun, ({ one }) => ({
	Thread: one(Thread, {
		fields: [AgentRun.threadId],
		references: [Thread.id],
	}),
	Agent: one(Agent, {
		fields: [AgentRun.agentId],
		references: [Agent.id],
	}),
	document: one(DatabaseDocument, {
		fields: [AgentRun.filesId],
		references: [DatabaseDocument.id],
	}),
}));
