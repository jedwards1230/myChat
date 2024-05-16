import fs from "fs";

export const isProd = process.env.NODE_ENV === "production";

export function purgeLogFiles(logsDir: string) {
	if (!isProd) {
		return;
	}

	// Ensure the directory exists
	fs.mkdirSync(logsDir, { recursive: true });
	// Purge all log files
	fs.rmSync(logsDir, { recursive: true, force: true });
}
