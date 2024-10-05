import { logger } from "@/lib/logger";

import { buildApp } from "./app";
import { Config } from "./config";

const app = await buildApp();

app.listen({ port: Config.port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
	logger.info(`Server is running at ${address}`);
	logger.info(`JSON: ${address}/openapi.json`);
	logger.info(`UI:   ${address}/docs`);
});

process.on("SIGINT", async () => {
	logger.info("Received SIGINT. Graceful shutdown in progress...");
	await app.close();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	logger.info("Received SIGTERM. Graceful shutdown in progress...");
	await app.close();
	process.exit(0);
});
