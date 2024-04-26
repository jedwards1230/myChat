import "reflect-metadata";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyRateLimit from "@fastify/rate-limit";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { Config } from "./config";
import { getUser } from "./hooks/getUser";
import { setupLogger } from "./hooks/setupLogger";
import { setupDatabase } from "./hooks/setupDatabase";

import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";
import { setupAgentRunsRoute } from "./routes/threads/runs";
import { setupServerRoute } from "./routes/server";
import { setupModelsRoute } from "./routes/models";

export const app = Fastify({
	logger: false,
	...Config.sslOptions,
});

export type BuildAppParams = {
	resetDbOnInit: boolean;
	staticClientFilesDir: string;
};

export async function buildApp({
	resetDbOnInit,
	staticClientFilesDir,
}: BuildAppParams | undefined = Config) {
	// Initialize Database
	await app.register(setupDatabase, { resetDbOnInit });

	// Access Logger
	await app.register(setupLogger);

	// Type Providers
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.withTypeProvider<ZodTypeProvider>();

	// Hooks
	await app.register(fastifyMultipart);
	await app.register(fastifySwagger, {
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
	await app.register(fastifyRateLimit, {
		max: 100,
		timeWindow: "30s",
	});
	await app.register(fastifySwaggerUI, { routePrefix: "/docs" });
	await app.register(fastifyCors, { origin: "*" });

	// Api Routes
	await app.register(
		async (app) => {
			await app.register(setupServerRoute);
			await app.register(setupUserRoute);
			await app.register(setupModelsRoute);

			// authenticated routes
			await app.register(async (app) => {
				app.addHook("preHandler", getUser);

				await app.register(setupAgentsRoute, { prefix: "/agents" });
				await app.register(setupThreadsRoute, { prefix: "/threads" });
				await app.register(setupAgentRunsRoute, { prefix: "/threads" });
				await app.register(setupMessagesRoute, {
					prefix: "threads/:threadId/messages",
				});
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
