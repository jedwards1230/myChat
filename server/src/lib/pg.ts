import { DataSource } from "typeorm";

import logger from "./logs/logger";
import { DBLogger } from "./logs/dbLogger";

import { User } from "@/modules/User/UserModel";
import { Agent } from "@/modules/Agent/AgentModel";
import { Thread } from "@/modules/Thread/ThreadModel";
import { Message } from "@/modules/Message/MessageModel";
import { FileData, MessageFile } from "@/modules/File/MessageFileModel";
import { AgentRun } from "@/modules/AgentRun/AgentRunModel";
import { SocketSession } from "@/modules/User/SessionModel";
import { ToolCall } from "@/modules/Message/ToolCallModel";

// TODO: setup env vars
export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: 5432,
	username: "admin",
	password: "admin",
	database: "ChatDB",
	entities: [
		SocketSession,
		User,
		Agent,
		Thread,
		ToolCall,
		FileData,
		MessageFile,
		Message,
		AgentRun,
	],
	synchronize: true,
	logging: process.env.DEBUG_DB === "true" ? "all" : ["error", "warn"],
	logger: new DBLogger(),
	cache: true,
});

/** Initialize Database Connection */
export const initDb = async () => {
	await AppDataSource.initialize().catch((err) => {
		logger.error("Failed to connect to database", { err, functionName: "initDb" });
		process.exit(1);
	});

	logger.info("Connected to Postgres database", { functionName: "initDb" });
};

export async function resetDatabase() {
	logger.info("Resetting database", { functionName: "resetDatabase" });
	await AppDataSource.dropDatabase();
	await AppDataSource.synchronize();
	await AppDataSource.destroy();
	logger.info("Database reset", { functionName: "resetDatabase" });
}
