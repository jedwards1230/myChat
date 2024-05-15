import winston from "winston";
import { purgeLogFiles } from "./utils";
import { formats } from "./formats";
import { buildLogger } from "./logger";

export function buildServerLogger(path: string) {
	purgeLogFiles(path);

	const logger = buildLogger(path);

	const streamLogger = winston.createLogger({
		level: "debug",
		format: formats.streamLog,
		transports: [
			new winston.transports.File({
				filename: path + "/stream.log",
			}),
		],
	});

	const accessLogger = winston.createLogger({
		level: "debug",
		format: formats.accessLog,
		transports: [
			new winston.transports.File({
				filename: path + "/access.log",
			}),
		],
	});

	return {
		logger,
		streamLogger,
		accessLogger,
	};
}
