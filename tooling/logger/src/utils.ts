import fs from "fs";
import path from "path";

export const isProd = process.env.NODE_ENV === "production";

const DIR_NAME = "logs";
const SERVER_LOGS_DIR = path.normalize(path.join(process.cwd(), DIR_NAME));

const DB_DIR = "../../../packages/db";
const DB_LOGS_DIR = path.normalize(path.join(process.cwd(), DB_DIR));

function purgeLogFiles(type: "server" | "db") {
	const logsDir = type === "server" ? SERVER_LOGS_DIR : DB_LOGS_DIR;

	// Ensure the directory exists
	fs.mkdirSync(logsDir, { recursive: true });

	// Get the list of all files in the logs directory
	const dirs = fs
		.readdirSync(SERVER_LOGS_DIR, { withFileTypes: true })
		.map((dirent) => dirent.name);

	while (dirs.length > 0) {
		const oldestDir = dirs.pop();
		if (!oldestDir) break;
		fs.rmdirSync(path.join(SERVER_LOGS_DIR, oldestDir), { recursive: true });
	}

	return { SERVER_LOGS_DIR, DB_LOGS_DIR };
}

//export const getLogsDir = () => (Config.isProd ? purgeLogFiles() : LOGS_DIR);
export const getLogsDir = purgeLogFiles;
