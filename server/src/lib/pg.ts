import { DataSource } from "typeorm";

import { Config } from "@/config";
import logger from "./logs/logger";
import { DBLogger } from "./logs/dbLogger";

import { User } from "@/modules/User/UserModel";
import { Agent } from "@/modules/Agent/AgentModel";
import { Thread } from "@/modules/Thread/ThreadModel";
import { Message } from "@/modules/Message/MessageModel";
import { FileData, MessageFile } from "@/modules/MessageFile/MessageFileModel";
import { AgentRun } from "@/modules/AgentRun/AgentRunModel";
import { ToolCall } from "@/modules/Message/ToolCallModel";
import { UserSession } from "@/modules/User/SessionModel";
import { AgentTool } from "@/modules/Agent/AgentToolModel";

export const AppDataSource = new DataSource({
    ...Config.database,
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
        AgentRun,
    ],
    synchronize: true,
    logger: new DBLogger(),
});

/** Initialize Database Connection */
export const initDb = async () => {
    await AppDataSource.initialize().catch((err) => {
        logger.error(`Failed to connect to database: ${err.message}`, {
            functionName: "initDb",
        });
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
