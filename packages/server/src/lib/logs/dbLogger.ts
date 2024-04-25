import type { Logger as TypeORMLogger } from "typeorm";

import { dbLogger } from "./logger";

export class DBLogger implements TypeORMLogger {
	logQuery(query: string, parameters?: any[] | undefined) {
		dbLogger.debug(
			`Query: ${query} ${parameters ? `with parameters: ${parameters}` : ""}`
		);
	}

	logQueryError(error: string, query: string, parameters?: any[] | undefined) {
		const msg = `Query failed: ${error} with query: ${query} ${
			parameters ? `with parameters: ${parameters}` : ""
		}`;
		dbLogger.error(msg);
	}

	logQuerySlow(time: number, query: string, parameters?: any[] | undefined) {
		dbLogger.warn(
			`Query is slow: ${time}ms with query: ${query} ${
				parameters ? `with parameters: ${parameters}` : ""
			}`
		);
	}

	logSchemaBuild(message: string) {
		dbLogger.debug(`Schema build: ${message}`);
	}

	logMigration(message: string) {
		dbLogger.debug(`Migration: ${message}`);
	}

	log(level: "log" | "info" | "warn", message: any) {
		switch (level) {
			case "log":
			case "info":
				dbLogger.info(message);
				break;
			case "warn":
				dbLogger.warn(message);
				break;
		}
	}
}
