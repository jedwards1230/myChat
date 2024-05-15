import winston from "winston";
import { getLogsDir } from "./utils";
import { formats } from "./formats";
import { buildLogger } from "./logger";

export function buildServerLogger() {
	const { SERVER_LOGS_DIR } = getLogsDir("server");

	const logger = buildLogger(SERVER_LOGS_DIR);

	const streamLogger = winston.createLogger({
		level: "debug",
		format: formats.streamLog,
		transports: [
			new winston.transports.File({
				filename: SERVER_LOGS_DIR + "/stream.log",
			}),
		],
	});

	const accessLogger = winston.createLogger({
		level: "debug",
		format: formats.accessLog,
		transports: [
			new winston.transports.File({
				filename: SERVER_LOGS_DIR + "/access.log",
			}),
		],
	});

	return {
		logger,
		streamLogger,
		accessLogger,
	};
}
