import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Agent } from "./agent";
import { AgentTool } from "./agentTool";
import { DatabaseDocument } from "./document";
import { Thread } from "./thread";

export const User = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull().unique(),
	password: text("password").default("").notNull(),
	apiKey: uuid("apiKey").defaultRandom().notNull(),
	profilePicture: text("profilePicture").default("").notNull(),

	defaultAgentId: uuid("defaultAgentId").references((): AnyPgColumn => Agent.id),
});

export const UserRelations = relations(User, ({ one, many }) => ({
	defaultAgent: one(Agent, {
		fields: [User.defaultAgentId],
		references: [Agent.id],
	}),
	agentTools: many(AgentTool),
	agents: many(Agent),
	userSessions: many(UserSession),
	threads: many(Thread),
	documents: many(DatabaseDocument),
}));

export const CreateUserSchema = createInsertSchema(User, {
	name: z.string().max(256),
	email: z.string().email(),
	password: z.string().max(256),
}).omit({
	id: true,
	apiKey: true,
	profilePicture: true,
	defaultAgentId: true,
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const SelectUserSchema = createSelectSchema(User);
export type SelectUser = z.infer<typeof SelectUserSchema>;

export const UserSession = pgTable("user_session", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	expire: timestamp("expire", { mode: "string" }).notNull(),
	provider: text("provider").notNull(),
	ip: text("ip"),
	current: boolean("current").default(false).notNull(),
});

export const InsertUserSessionSchema = createInsertSchema(UserSession);
export type InsertUserSession = z.infer<typeof InsertUserSessionSchema>;

export const SelectUserSessionSchema = createSelectSchema(UserSession);
export type SelectUserSession = z.infer<typeof SelectUserSessionSchema>;
