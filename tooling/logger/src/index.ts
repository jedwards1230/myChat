import { purgeLogFiles } from "./utils";
import { buildLoggers, type BuildOpts } from "./loggers";

export function getLogger(opts: BuildOpts) {
	purgeLogFiles();

	const { prefix } = opts;
	const logger = buildLoggers(opts);
	return prefix ? logger.child({ prefix }) : logger;
}

export * from "./dbLogger";
