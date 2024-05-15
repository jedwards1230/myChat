import winston, { format } from "winston";
import { isProd } from "./utils";
import { mergeWithCommonFormats, formats } from "./formats";

export function buildLogger(logs_dir: string) {
	return winston.createLogger({
		level: "debug",
		format: mergeWithCommonFormats(format.json()),
		transports: [
			new winston.transports.File({
				filename: logs_dir + "/error.log",
				level: "error",
				handleExceptions: true,
				format: formats.errorLog,
			}),
			new winston.transports.File({
				filename: logs_dir + "/combined.log",
				format: formats.combinedLog,
			}),
			new winston.transports.File({
				filename: logs_dir + "/simple.log",
				format: formats.simpleLog,
			}),
			new winston.transports.Console({
				level: !isProd ? "debug" : "verbose",
				format: formats.consoleLog,
			}),
		],
		rejectionHandlers: [
			new winston.transports.File({ filename: logs_dir + "/rejections.log" }),
		],
	});
}
