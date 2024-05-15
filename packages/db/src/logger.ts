import { DBLogger, buildDbLogger } from "@mychat/logger/db";

const baseLogger = buildDbLogger();

export const { logger, dbLogger } = {
	...baseLogger,
	dbLogger: new DBLogger(baseLogger.dbLogger),
};
