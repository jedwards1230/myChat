import fs from "fs";
import path from "path";

export const logsDir = path.resolve(__dirname, "../../../logs");

export const isProd = process.env.NODE_ENV === "production";

export function purgeLogFiles() {
	// Ensure the directory exists
	fs.mkdirSync(logsDir, { recursive: true });
	// Purge all log files
	fs.rmSync(logsDir, { recursive: true, force: true });
}
