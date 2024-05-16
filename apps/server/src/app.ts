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
import { setupRoutes } from "./routes";

import { setupLogger } from "./hooks/setupLogger";
import { setupDatabase } from "./hooks/setupDatabase";

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
				description: "Fastify based API for myChat",
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
	await app.register(async (app) => setupRoutes(app), { prefix: "/api" });

	await app.register(fastifyStatic, {
		root: staticClientFilesDir,
		prefix: "/",
	});

	return app;
}
