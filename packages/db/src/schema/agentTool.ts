import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Agent } from "./agent";
import { User } from "./user";

export const AgentTool = pgTable("AgentTool", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	name: text("name").notNull(),
	enabled: boolean("enabled").default(false).notNull(),
	description: text("description").notNull(),
	parameters: jsonb("parameters").notNull(),
	toolName: text("toolName").notNull(),
	version: integer("version").notNull(),
	ownerId: uuid("ownerId").references(() => User.id),
});

export const InsertAgentToolSchema = createInsertSchema(AgentTool);
export type InsertAgentTool = z.infer<typeof InsertAgentToolSchema>;

export const SelectAgentToolSchema = createSelectSchema(AgentTool);
export type SelectAgentTool = z.infer<typeof SelectAgentToolSchema>;

export const agent_tools_agent_tool = pgTable(
	"agent_tools_agent_tool",
	{
		agentId: uuid("agentId")
			.notNull()
			.references(() => Agent.id, { onDelete: "cascade", onUpdate: "cascade" }),
		agentToolId: uuid("agentToolId")
			.notNull()
			.references(() => AgentTool.id),
	},
	(table) => {
		return {
			IDX_adabee28ab05d5e8eb77010915: index("IDX_adabee28ab05d5e8eb77010915").on(
				table.agentId,
			),
			IDX_7faea4e95f26d2f121c9624389: index("IDX_7faea4e95f26d2f121c9624389").on(
				table.agentToolId,
			),
			PK_a3f4e7c952796e91f6c6509146b: primaryKey({
				columns: [table.agentId, table.agentToolId],
				name: "PK_a3f4e7c952796e91f6c6509146b",
			}),
		};
	},
);

export const AgentToolRelations = relations(AgentTool, ({ one, many }) => ({
	User: one(User, {
		fields: [AgentTool.ownerId],
		references: [User.id],
	}),
	agent_tools_agent_tools: many(agent_tools_agent_tool),
}));

export const agent_tools_agent_toolRelations = relations(
	agent_tools_agent_tool,
	({ one }) => ({
		Agent: one(Agent, {
			fields: [agent_tools_agent_tool.agentId],
			references: [Agent.id],
		}),
		AgentTool: one(AgentTool, {
			fields: [agent_tools_agent_tool.agentToolId],
			references: [AgentTool.id],
		}),
	}),
);
