import { pgTable, pgEnum, serial, bigint, varchar, type AnyPgColumn, foreignKey, unique, uuid, text, timestamp, boolean, jsonb, integer, index, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const Message_role_enum = pgEnum("Message_role_enum", ['system', 'user', 'assistant', 'tool'])
export const ToolCall_type_enum = pgEnum("ToolCall_type_enum", ['function'])


export const migrations = pgTable("migrations", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint("timestamp", { mode: "number" }).notNull(),
	name: varchar("name").notNull(),
});

export const User = pgTable("User", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	apiKey: varchar("apiKey", { length: 255 }).notNull(),
	name: text("name").default('New User').notNull(),
	email: text("email").notNull(),
	password: text("password").default('').notNull(),
	profilePicture: text("profilePicture").default('').notNull(),
	defaultAgentId: uuid("defaultAgentId").references((): AnyPgColumn => Agent.id),
},
(table) => {
	return {
		UQ_4a257d2c9837248d70640b3e36e: unique("UQ_4a257d2c9837248d70640b3e36e").on(table.email),
	}
});

export const AgentTool = pgTable("AgentTool", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	name: text("name").notNull(),
	enabled: boolean("enabled").default(false).notNull(),
	description: text("description").notNull(),
	parameters: jsonb("parameters").notNull(),
	toolName: text("toolName").notNull(),
	version: integer("version").notNull(),
	ownerId: uuid("ownerId").references(() => User.id),
});

export const Agent = pgTable("Agent", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	name: text("name").default('myChat Agent').notNull(),
	model: jsonb("model").default({"api":"openai","name":"gpt-4o","params":{"N":1,"topP":1,"maxTokens":128000,"temperature":0.7,"presencePenalty":0,"frequencyPenalty":0},"serviceName":"OpenAIService"}).notNull(),
	toolsEnabled: boolean("toolsEnabled").default(true).notNull(),
	systemMessage: text("systemMessage").default('You are a personal assistant.').notNull(),
	version: integer("version").notNull(),
	ownerId: uuid("ownerId").references((): AnyPgColumn => User.id),
});

export const UserSession = pgTable("UserSession", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	expire: timestamp("expire", { mode: 'string' }).notNull(),
	provider: text("provider").notNull(),
	ip: text("ip"),
	current: boolean("current").default(false).notNull(),
	userId: uuid("userId").references(() => User.id),
});

export const Thread = pgTable("Thread", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow().notNull(),
	lastModified: timestamp("lastModified", { mode: 'string' }).defaultNow().notNull(),
	title: text("title"),
	version: integer("version").notNull(),
	activeMessageId: uuid("activeMessageId").references((): AnyPgColumn => Message.id),
	agentId: uuid("agentId").references(() => Agent.id),
	userId: uuid("userId").references(() => User.id),
},
(table) => {
	return {
		REL_e890a2d3645547f7bf2e204d63: unique("REL_e890a2d3645547f7bf2e204d63").on(table.activeMessageId),
	}
});

export const document = pgTable("document", {
	id: serial("id").primaryKey().notNull(),
	decoded: text("decoded").notNull(),
	metadata: jsonb("metadata").notNull(),
	tokenCount: integer("tokenCount"),
	threadId: uuid("threadId").references(() => Thread.id),
	userId: uuid("userId").references(() => User.id),
	messageId: uuid("messageId").references(() => Message.id),
});

export const Message = pgTable("Message", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	content: text("content"),
	role: Message_role_enum("role").notNull(),
	name: text("name"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	tokenCount: integer("tokenCount").default(0).notNull(),
	threadId: uuid("threadId").references((): AnyPgColumn => Thread.id, { onDelete: "cascade" } ),
	toolCallIdId: text("toolCallIdId").references((): AnyPgColumn => ToolCall.id),
	parentId: uuid("parentId"),
},
(table) => {
	return {
		FK_46dd2ddc370017214fef302ca8f: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "FK_46dd2ddc370017214fef302ca8f"
		}),
		REL_8b38a933c77f4398908d09febe: unique("REL_8b38a933c77f4398908d09febe").on(table.toolCallIdId),
	}
});

export const MessageFile = pgTable("MessageFile", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: text("name").notNull(),
	path: text("path"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lastModified: bigint("lastModified", { mode: "number" }),
	uploadDate: timestamp("uploadDate", { mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint("size", { mode: "number" }).notNull(),
	mimetype: text("mimetype").notNull(),
	tokenCount: integer("tokenCount"),
	extension: text("extension").notNull(),
	parsedText: text("parsedText"),
	fileDataId: uuid("fileDataId").references((): AnyPgColumn => FileData.id),
	messageId: uuid("messageId").references(() => Message.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		REL_251e73e4405200edd05f962ef0: unique("REL_251e73e4405200edd05f962ef0").on(table.fileDataId),
	}
});

export const FileData = pgTable("FileData", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	// TODO: failed to parse database type 'bytea'
	blob: unknown("blob").notNull(),
	messageFileId: uuid("messageFileId").references((): AnyPgColumn => MessageFile.id),
},
(table) => {
	return {
		REL_bb4c5813ed4c9713c3068289a7: unique("REL_bb4c5813ed4c9713c3068289a7").on(table.messageFileId),
	}
});

export const ToolCall = pgTable("ToolCall", {
	id: text("id").primaryKey().notNull(),
	function: jsonb("function"),
	content: text("content"),
	type: ToolCall_type_enum("type").default('function').notNull(),
	version: integer("version").notNull(),
	assistantMessageId: uuid("assistantMessageId").references((): AnyPgColumn => Message.id),
});

export const AgentRun = pgTable("AgentRun", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	model: jsonb("model").notNull(),
	status: text("status").default('queued').notNull(),
	type: text("type").notNull(),
	stream: boolean("stream").default(true).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	threadId: uuid("threadId").references(() => Thread.id, { onDelete: "cascade" } ),
	agentId: uuid("agentId").references(() => Agent.id),
	filesId: integer("filesId").references(() => document.id),
});

export const embed_item = pgTable("embed_item", {
	id: serial("id").primaryKey().notNull(),
	// TODO: failed to parse database type 'vector'
	embedding: unknown("embedding").notNull(),
});

export const agent_tools_agent_tool = pgTable("agent_tools_agent_tool", {
	agentId: uuid("agentId").notNull().references(() => Agent.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	agentToolId: uuid("agentToolId").notNull().references(() => AgentTool.id),
},
(table) => {
	return {
		IDX_adabee28ab05d5e8eb77010915: index("IDX_adabee28ab05d5e8eb77010915").on(table.agentId),
		IDX_7faea4e95f26d2f121c9624389: index("IDX_7faea4e95f26d2f121c9624389").on(table.agentToolId),
		PK_a3f4e7c952796e91f6c6509146b: primaryKey({ columns: [table.agentId, table.agentToolId], name: "PK_a3f4e7c952796e91f6c6509146b"}),
	}
});

export const Message_closure = pgTable("Message_closure", {
	id_ancestor: uuid("id_ancestor").notNull().references(() => Message.id, { onDelete: "cascade" } ),
	id_descendant: uuid("id_descendant").notNull().references(() => Message.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		IDX_941ea848f09d43306b75ea9791: index("IDX_941ea848f09d43306b75ea9791").on(table.id_ancestor),
		IDX_090362f69add0ffff1dcc98539: index("IDX_090362f69add0ffff1dcc98539").on(table.id_descendant),
		PK_883bac06f134fb892a0a01d72c0: primaryKey({ columns: [table.id_ancestor, table.id_descendant], name: "PK_883bac06f134fb892a0a01d72c0"}),
	}
});