import { purgeLogFiles } from "./utils";
import { buildLoggers, type Loggers } from "./loggers";

export type BuildOpts = { type: Loggers; prefix: string };

export function getLogger({ prefix, type }: BuildOpts) {
	purgeLogFiles();

	const logger = buildLoggers(type);
	return prefix ? logger.child({ prefix }) : logger;
}

export * from "./dbLogger";
