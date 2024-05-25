import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { AgentRun } from "./agentRun";
import { AgentTool } from "./agentTool";
import { ModelApi } from "./models";
import { Thread } from "./thread";
import { User } from "./user";

export const Agent = pgTable("Agent", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	name: text("name").default("myChat Agent").notNull(),
	model: jsonb("model")
		.$type<ModelApi>()
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

	ownerId: uuid("ownerId").references((): AnyPgColumn => User.id),
});

export const AgentRelations = relations(Agent, ({ one, many }) => ({
	owner: one(User, {
		fields: [Agent.ownerId],
		references: [User.id],
	}),
	users: many(User),
	threads: many(Thread),
	runs: many(AgentRun),
	tools: many(AgentTool),
}));

export const AgentSchema = createSelectSchema(Agent, {
	model: ModelApi,
});
export type Agent = z.infer<typeof AgentSchema>;

export const CreateAgentSchema = createInsertSchema(Agent, {
	model: ModelApi,
}).omit({
	id: true,
	createdAt: true,
});
export type CreateAgent = z.infer<typeof CreateAgentSchema>;
