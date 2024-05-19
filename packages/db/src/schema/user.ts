import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Agent } from "./agent";
import { AgentTool } from "./agentTool";
import { DatabaseDocument } from "./document";
import { Thread } from "./thread";

export const User = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull().unique(),
	password: text("password").default("").notNull(),
	apiKey: varchar("apiKey", { length: 255 }).notNull(),
	profilePicture: text("profilePicture").default("").notNull(),
	defaultAgentId: uuid("defaultAgentId").references((): AnyPgColumn => Agent.id),
});

export const UserRelations = relations(User, ({ one, many }) => ({
	Agent: one(Agent, {
		fields: [User.defaultAgentId],
		references: [Agent.id],
		relationName: "User_defaultAgentId_Agent_id",
	}),
	AgentTools: many(AgentTool),
	Agents: many(Agent, {
		relationName: "Agent_ownerId_User_id",
	}),
	UserSessions: many(UserSession),
	Threads: many(Thread),
	documents: many(DatabaseDocument),
}));

export const UserSession = pgTable("user_session", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	expire: timestamp("expire", { mode: "string" }).notNull(),
	provider: text("provider").notNull(),
	ip: text("ip"),
	current: boolean("current").default(false).notNull(),
	userId: uuid("userId").references(() => User.id),
});

export const UserSessionRelations = relations(UserSession, ({ one }) => ({
	User: one(User, {
		fields: [UserSession.userId],
		references: [User.id],
	}),
}));

export const InsertUserSchema = createInsertSchema(User);
export type InsertUser = z.infer<typeof InsertUserSchema>;

export const SelectUserSchema = createSelectSchema(User);
export type SelectUser = z.infer<typeof SelectUserSchema>;
