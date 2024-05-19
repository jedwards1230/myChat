import type { Loggers } from "./loggers";
import { buildLoggers } from "./loggers";
import { purgeLogFiles } from "./utils";

export interface BuildOpts {
	type: Loggers;
	prefix: string;
}

export function getLogger({ prefix, type }: BuildOpts) {
	purgeLogFiles();

	const logger = buildLoggers(type);
	return prefix ? logger.child({ prefix }) : logger;
}

export * from "./dbLogger";
