import type { Logger as TypeORMLogger } from "typeorm";
import winston from "winston";

import { getLogsDir } from "./utils";
import { formats } from "./formats";
import { buildLogger } from "./logger";

export function buildDbLogger() {
	const { DB_LOGS_DIR } = getLogsDir("db");

	const logger = buildLogger(DB_LOGS_DIR);

	const dbLogger = winston.createLogger({
		level: "debug",
		format: formats.combinedLog,
		transports: [
			new winston.transports.File({
				filename: DB_LOGS_DIR + "/db.log",
			}),
		],
	});

	return {
		logger,
		dbLogger,
	};
}

export class DBLogger implements TypeORMLogger {
	constructor(private dbLogger: winston.Logger) {}

	logQuery(query: string, parameters?: any[] | undefined) {
		this.dbLogger.debug(
			`Query: ${query} ${parameters ? `with parameters: ${parameters}` : ""}`
		);
	}

	logQueryError(error: string, query: string, parameters?: any[] | undefined) {
		const msg = `Query failed: ${error} with query: ${query} ${
			parameters ? `with parameters: ${parameters}` : ""
		}`;
		this.dbLogger.error(msg);
	}

	logQuerySlow(time: number, query: string, parameters?: any[] | undefined) {
		this.dbLogger.warn(
			`Query is slow: ${time}ms with query: ${query} ${
				parameters ? `with parameters: ${parameters}` : ""
			}`
		);
	}

	logSchemaBuild(message: string) {
		this.dbLogger.debug(`Schema build: ${message}`);
	}

	logMigration(message: string) {
		this.dbLogger.debug(`Migration: ${message}`);
	}

	log(level: "log" | "info" | "warn", message: any) {
		switch (level) {
			case "log":
			case "info":
				this.dbLogger.info(message);
				break;
			case "warn":
				this.dbLogger.warn(message);
				break;
		}
	}
}
