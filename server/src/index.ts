import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyOpenApi from "@eropple/fastify-openapi3";
import fastifyStatic from "@fastify/static";

import type { OAS3PluginOptions } from "@eropple/fastify-openapi3";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { Config } from "./config";
import { initDb, resetDatabase } from "./lib/pg";
import logger, { accessLogger } from "./lib/logs/logger";
import { init } from "./lib/utils";
import { authenticate } from "./middleware/auth";

import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";
import { setupAgentRunsRoute } from "./routes/threads/runs";
import { setupModelsRoute } from "./routes/models";

// Connect to Postgres and initialize TypeORM
if (Config.resetDbOnInit) {
	await initDb();
	await resetDatabase();
}
await initDb();
await init();

export const app = Fastify({
	logger: false,
	...Config.sslOptions,
}).withTypeProvider<TypeBoxTypeProvider>();

const pluginOpts: OAS3PluginOptions = {
	openapiInfo: { title: "myChat API", version: "0.1.0" },
	publish: { ui: "rapidoc", json: true },
};

// Middleware
await app.register(fastifyMultipart);
await app.register(fastifyOpenApi, { ...pluginOpts });
await app.register(fastifyCors, { origin: "*" });

// Access Logger
app.addHook("onRequest", async (request, reply) => {
	accessLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
	logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`, {
		functionName: "onRequest",
	});
});

app.setErrorHandler(function (error, request, reply) {
	logger.error("Fastify error", {
		error,
		params: request.params,
		method: request.method,
		url: request.url,
		body: request.body,
		headers: request.headers,
	});
	reply.status(409).send({ ok: false });
});

// Api Routes
await app.register(
	async (app, opts) => {
		await app.register(setupUserRoute);
		await app.register(setupModelsRoute);

		await app.register(async (app, opts) => {
			app.addHook("preHandler", authenticate);

			await app.register(setupAgentsRoute, { prefix: "/agents" });
			await app.register(setupThreadsRoute, { prefix: "/threads" });
			await app.register(setupAgentRunsRoute, { prefix: "/threads" });
			await app.register(setupMessagesRoute, {
				prefix: "threads/:threadId/messages",
			});

			app.get(
				"/reset",
				{ oas: { description: "Reset the database", tags: ["Admin"] } },
				async (req, res) => {
					await resetDatabase();
					await initDb();
					await init();
					res.send({ ok: true });
				}
			);
		});
	},
	{ prefix: "/api" }
);

await app.register(fastifyStatic, {
	root: Config.staticClientFilesDir,
	prefix: "/",
});

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
