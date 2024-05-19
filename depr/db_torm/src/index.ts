import { AppDataSource } from "./data-source.js";
import { logger } from "./logger.js";

/** Initialize Database Connection */
const initDb = async () => {
	await AppDataSource.initialize().catch((err) => {
		logger.error(`Failed to connect to database: ${err.message}`, {
			functionName: "initDb",
		});
		process.exit(1);
	});

	logger.info("Connected to Postgres database", { functionName: "initDb" });
};

async function resetDatabase() {
	logger.info("Resetting database", { functionName: "resetDatabase" });
	await AppDataSource.synchronize(true);
	await AppDataSource.destroy();
	await initDb();
	logger.info("Database reset", { functionName: "resetDatabase" });
}

export { AppDataSource, initDb, resetDatabase };
