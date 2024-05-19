import type { AnyPgColumn } from "drizzle-orm/pg-core";
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

import { AgentRun } from "./agentRun";
import { agent_tools_agent_tool } from "./agentTool";
import { Thread } from "./thread";
import { User } from "./user";

export const Agent = pgTable("Agent", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	name: text("name").default("myChat Agent").notNull(),
	model: jsonb("model")
		.default({
			api: "openai",
			name: "gpt-4o",
			params: {
				N: 1,
				topP: 1,
				maxTokens: 128000,
				temperature: 0.7,
				presencePenalty: 0,
				frequencyPenalty: 0,
			},
			serviceName: "OpenAIService",
		})
		.notNull(),
	toolsEnabled: boolean("toolsEnabled").default(true).notNull(),
	systemMessage: text("systemMessage")
		.default("You are a personal assistant.")
		.notNull(),
	version: integer("version").notNull(),
	ownerId: uuid("ownerId").references((): AnyPgColumn => User.id),
});

export const InsertAgentSchema = createInsertSchema(Agent);
export type InsertAgent = z.infer<typeof InsertAgentSchema>;

export const SelectAgentSchema = createSelectSchema(Agent);
export type SelectAgent = z.infer<typeof SelectAgentSchema>;

export const AgentRelations = relations(Agent, ({ one, many }) => ({
	Users: many(User, {
		relationName: "User_defaultAgentId_Agent_id",
	}),
	User: one(User, {
		fields: [Agent.ownerId],
		references: [User.id],
		relationName: "Agent_ownerId_User_id",
	}),
	Threads: many(Thread),
	AgentRuns: many(AgentRun),
	agent_tools_agent_tools: many(agent_tools_agent_tool),
}));
