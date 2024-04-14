import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyORM from "typeorm-fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { Config } from "./config";
import { initDb, resetDatabase, AppDataSource } from "./lib/pg";
import logger, { accessLogger } from "./lib/logs/logger";
import { authenticate } from "./hooks/auth";

import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";
import { setupAgentRunsRoute } from "./routes/threads/runs";
import { setupModelsRoute } from "./routes/models";
import { errorHandler } from "./errors";

export const app = Fastify({
	logger: false,
	...Config.sslOptions,
});

export type BuildAppParams = {
	isProd: boolean;
	resetDbOnInit: boolean;
	staticClientFilesDir: string;
	sessionSecret: string;
};

export async function buildApp(
	{
		isProd,
		resetDbOnInit,
		staticClientFilesDir,
		sessionSecret,
	}: BuildAppParams | undefined = {
		isProd: Config.isProd,
		resetDbOnInit: Config.resetDbOnInit,
		staticClientFilesDir: Config.staticClientFilesDir,
		sessionSecret: Config.sessionSecret,
	}
) {
	// Connect to Postgres and initialize TypeORM
	if (resetDbOnInit) {
		await initDb();
		await resetDatabase();
	}
	await app.register(fastifyORM, { connection: AppDataSource });

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.withTypeProvider<ZodTypeProvider>();

	// Hooks
	await app.register(fastifyMultipart);
	app.register(fastifySwagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "myChat API",
				description: "Sample backend service",
				version: "0.1.0",
			},
			servers: [],
		},
		transform: jsonSchemaTransform,
	});

	app.register(fastifySwaggerUI, {
		routePrefix: "/docs",
	});
	await app.register(fastifyCors, { origin: "*" });

	// Access Logger
	app.addHook("onRequest", async (request, reply) => {
		accessLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
		logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`);
	});

	app.setErrorHandler(errorHandler);

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
					{ schema: { description: "Reset the database", tags: ["Admin"] } },
					async (req, res) => {
						await resetDatabase();
						await initDb();
						res.send({ ok: true });
					}
				);
			});
		},
		{ prefix: "/api" }
	);

	await app.register(fastifyStatic, {
		root: staticClientFilesDir,
		prefix: "/",
	});

	return app;
}
