import "reflect-metadata";

import { DataSource } from "typeorm";

import { Agent } from "./entity/Agent";
import { AgentRun } from "./entity/AgentRun";
import { AgentTool } from "./entity/AgentTool";
import { DatabaseDocument, EmbedItem } from "./entity/Document";
import { Message } from "./entity/Message";
import { FileData, MessageFile } from "./entity/MessageFile";
import { UserSession } from "./entity/Session";
import { Thread } from "./entity/Thread";
import { ToolCall } from "./entity/ToolCall";
import { User } from "./entity/User";
import { typeormLogger } from "./logger";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST ?? "localhost",
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
	username: process.env.DB_USER ?? "admin",
	password: process.env.DB_PASSWORD ?? "admin",
	database: process.env.DB_NAME ?? "ChatDB",
	logging: process.env.DB_DEBUG ? "all" : ["error", "warn"],
	entities: [
		User,
		UserSession,
		AgentTool,
		Agent,
		Thread,
		ToolCall,
		FileData,
		MessageFile,
		Message,
		EmbedItem,
		DatabaseDocument,
		AgentRun,
	],
	logger: process.env.ENABLE_DB_LOGGER ? typeormLogger : undefined,
	migrations: [`${__dirname}/**/migration/*.{ts,js}`],
	subscribers: [],
});
