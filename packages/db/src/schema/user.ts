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

export const UserSchema = createSelectSchema(User);
export type User = z.infer<typeof UserSchema>;

export const UserSession = pgTable("user_session", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
	expire: timestamp("expire", { mode: "string" }).notNull(),
	provider: text("provider").notNull(),
	ip: text("ip"),
	current: boolean("current").default(false).notNull(),

	userId: uuid("userId").references((): AnyPgColumn => User.id),
});

export const CreateUserSessionSchema = createInsertSchema(UserSession, {
	userId: z.string().uuid(),
	provider: z.string().max(256),
	ip: z.string().max(256),
	expire: z.date(),
}).omit({
	id: true,
	createdAt: true,
	current: true,
});
export type CreateUserSession = z.infer<typeof CreateUserSessionSchema>;

export const UserSessionSchema = createSelectSchema(UserSession);
export type UserSession = z.infer<typeof UserSessionSchema>;
