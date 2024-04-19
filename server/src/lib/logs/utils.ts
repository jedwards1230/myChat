import stringify from "json-stringify-safe";
import { format } from "winston";
import fs from "fs";
import path from "path";
import { Config } from "@/config";

const DIR_NAME = "logs";
const LOGS_DIR = path.normalize(path.join(process.cwd(), DIR_NAME));

// Ensure the directory exists
fs.mkdirSync(LOGS_DIR, { recursive: true });

const combinedLogFormat = format.printf(
	({ level, message, timestamp, functionName, error, ...metadata }) => {
		const functionNameStr = functionName ? `${functionName} - ` : "";
		let msg = `${timestamp} [${level}]: ${functionNameStr}${message} `;

		if (error) {
			msg += `\nError: ${error.stack || error.message || stringify(error)}`;
		}
		if (Object.keys(metadata).length !== 0) {
			msg += `\n${stringify(metadata, null, 2)}`;
		}

		return msg;
	}
);
const consoleLogFormat = format.printf(
	({ level, message, functionName, error, ...metadata }) => {
		const functionNameStr = functionName ? `${functionName} - ` : "";
		let msg = `${level}: ${functionNameStr}${message} `;

		if (error) {
			msg += `\nError: ${error.stack || error.message || stringify(error)}`;
		}
		if (Object.keys(metadata).length !== 0) {
			msg += `\n${stringify(metadata, null, 2)}`;
		}

		return msg;
	}
);
const simpleLogFormat = format.printf(
	({ level, message, timestamp, functionName, error, ...metadata }) => {
		const functionNameStr = functionName ? `${functionName} - ` : "";
		let msg = `${timestamp} [${level}]: ${functionNameStr}${message} `;

		msg += stringify({
			...metadata,
			error,
		});

		return msg;
	}
);

export const formats = {
	combinedLog: combinedLogFormat,
	consoleLog: consoleLogFormat,
	simpleLog: simpleLogFormat,
};

function purgeLogFiles() {
	// Get the list of all files in the logs directory
	const dirs = fs
		.readdirSync(LOGS_DIR, { withFileTypes: true })
		.map((dirent) => dirent.name);

	while (dirs.length > 0) {
		const oldestDir = dirs.pop();
		if (!oldestDir) break;
		fs.rmdirSync(path.join(LOGS_DIR, oldestDir), { recursive: true });
	}

	return LOGS_DIR;
}

export const getLogsDir = () => (Config.isProd ? purgeLogFiles() : LOGS_DIR);
