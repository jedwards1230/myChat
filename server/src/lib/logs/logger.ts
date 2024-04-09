import winston, { format } from "winston";
import { formats as baseFormats, getLogsDir } from "./utils";
import { Config } from "@/config";

const LOGS_DIR = getLogsDir();

const commonFormats = format.combine(
	format.errors({ stack: true }),
	format.splat(),
	format.simple()
);

const mergeWithCommonFormats = (...formats: winston.Logform.Format[]) =>
	format.combine(commonFormats, ...formats);

const fileFormats = format.combine(
	format.timestamp({
		format: "YYYY-MM-DD HH:mm:ss",
	})
);

const formats = {
	errorLog: mergeWithCommonFormats(fileFormats, format.prettyPrint()),
	combinedLog: mergeWithCommonFormats(fileFormats, baseFormats.combinedLog),
	consoleLog: mergeWithCommonFormats(format.colorize(), baseFormats.consoleLog),
	simpleLog: mergeWithCommonFormats(fileFormats, baseFormats.simpleLog),
	streamLog: mergeWithCommonFormats(fileFormats, baseFormats.combinedLog),
	accessLog: mergeWithCommonFormats(fileFormats, baseFormats.simpleLog),
};

const logger = winston.createLogger({
	level: "debug",
	format: mergeWithCommonFormats(format.json()),
	transports: [
		new winston.transports.File({
			filename: LOGS_DIR + "/error.log",
			level: "error",
			handleExceptions: true,
			format: formats.errorLog,
		}),
		new winston.transports.File({
			filename: LOGS_DIR + "/combined.log",
			format: formats.combinedLog,
		}),
		new winston.transports.File({
			filename: LOGS_DIR + "/simple.log",
			format: formats.simpleLog,
		}),
		new winston.transports.Console({
			level: !Config.isProd ? "debug" : "verbose",
			format: formats.consoleLog,
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({ filename: LOGS_DIR + "/rejections.log" }),
	],
});

export const streamLogger = winston.createLogger({
	level: "debug",
	format: formats.streamLog,
	transports: [
		new winston.transports.File({
			filename: LOGS_DIR + "/stream.log",
		}),
	],
});

export const dbLogger = winston.createLogger({
	level: "debug",
	format: formats.combinedLog,
	transports: [
		new winston.transports.File({
			filename: LOGS_DIR + "/db.log",
		}),
	],
});

export const accessLogger = winston.createLogger({
	level: "debug",
	format: formats.accessLog,
	transports: [
		new winston.transports.File({
			filename: LOGS_DIR + "/access.log",
		}),
	],
});

export default logger;
