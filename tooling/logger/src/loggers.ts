import winston, { format } from "winston";
import { mergeWithCommonFormats, formats } from "./formats";
import { isProd, logsDir } from "./utils";

export type Loggers = "common" | "stream" | "access" | "db";

export function buildLoggers(type: Loggers) {
	const dirname = logsDir;
	switch (type) {
		case "common":
			return winston.loggers.add("common", {
				level: "debug",
				format: mergeWithCommonFormats(format.json()),
				transports: [
					new winston.transports.File({
						filename: dirname + "/error.log",
						level: "error",
						handleExceptions: true,
						format: formats.errorLog,
					}),
					new winston.transports.File({
						filename: dirname + "/combined.log",
						format: formats.combinedLog,
					}),
					new winston.transports.Console({
						level: !isProd ? "debug" : "verbose",
						format: formats.consoleLog,
					}),
				],
			});
		case "stream":
			return winston.loggers.add("stream", {
				level: "debug",
				format: formats.streamLog,
				transports: [
					new winston.transports.File({
						filename: dirname + "/stream.log",
					}),
				],
			});
		case "access":
			return winston.loggers.add("access", {
				level: "debug",
				format: formats.accessLog,
				transports: [
					new winston.transports.File({
						filename: dirname + "/access.log",
					}),
				],
			});
		case "db":
			return winston.loggers.add("db", {
				level: "debug",
				format: formats.combinedLog,
				transports: [
					new winston.transports.File({
						filename: dirname + "/db.log",
					}),
				],
			});
		default:
			return winston.loggers.add("default", {
				level: "debug",
				format: mergeWithCommonFormats(format.json()),
				transports: [
					new winston.transports.Console({
						level: !isProd ? "debug" : "verbose",
						format: formats.consoleLog,
					}),
				],
			});
	}
}
