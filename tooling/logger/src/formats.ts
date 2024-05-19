import type { Logform } from "winston";
import stringify from "json-stringify-safe";
import { format } from "winston";

export const mergeWithCommonFormats = (...formats: Logform.Format[]) =>
	format.combine(commonFormats, ...formats);

const combinedLogFormat = format.printf(
	({ level, prefix, message, timestamp, functionName, error, ...metadata }) => {
		let msg = [
			timestamp,
			`[${level}]:`,
			prefix ? `(${prefix})` : "",
			functionName ? `${functionName} - ` : "",
			message,
		]
			.filter(Boolean)
			.join(" ");

		if (error) {
			msg += `\nError: ${error.stack || error.message || stringify(error)}`;
		}
		if (Object.keys(metadata).length !== 0) {
			msg += `\n${stringify(metadata, null, 2)}`;
		}

		return msg;
	},
);
const consoleLogFormat = format.printf(
	({ level, prefix = "", message, functionName, error, ...metadata }) => {
		let msg = [
			`[${level}]:`,
			prefix ? `(${prefix})` : "",
			functionName ? `${functionName} - ` : "",
			message,
		].join(" ");

		if (error) {
			msg += `\nError: ${error.stack || error.message || stringify(error)}`;
		}
		if (Object.keys(metadata).length !== 0) {
			msg += `\n${stringify(metadata, null, 2)}`;
		}

		return msg;
	},
);
const simpleLogFormat = format.printf(
	({ level, prefix = "", message, timestamp, functionName, error, ...metadata }) => {
		let msg = [
			timestamp,
			`[${level}]:`,
			prefix ? `(${prefix})` : "",
			functionName ? `${functionName} - ` : "",
			message,
		].join(" ");

		msg += stringify({
			...metadata,
			error,
		});

		return msg;
	},
);

const commonFormats = format.combine(
	format.errors({ stack: true }),
	format.splat(),
	format.simple(),
);

const fileFormats = format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }));

export const formats = {
	errorLog: mergeWithCommonFormats(fileFormats, format.prettyPrint()),
	combinedLog: mergeWithCommonFormats(fileFormats, combinedLogFormat),
	consoleLog: mergeWithCommonFormats(format.colorize(), consoleLogFormat),
	simpleLog: mergeWithCommonFormats(fileFormats, simpleLogFormat),
	streamLog: mergeWithCommonFormats(fileFormats, combinedLogFormat),
	accessLog: mergeWithCommonFormats(fileFormats, simpleLogFormat),
};
