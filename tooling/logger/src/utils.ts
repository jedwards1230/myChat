import fs from "fs";
import path from "path";

export const isProd = process.env.NODE_ENV === "production";

export function purgeLogFiles(logsDir: string) {
	// Ensure the directory exists
	fs.mkdirSync(logsDir, { recursive: true });

	fs.rmSync(logsDir, { recursive: true, force: true });
}
