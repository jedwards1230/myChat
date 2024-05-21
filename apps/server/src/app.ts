import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import type { AppRouter } from "@mychat/api";
import { appRouter, createTRPCContextFastify as createContext } from "@mychat/api";

import { Config } from "./config";
import { setupDatabase } from "./hooks/setupDatabase";
import { setupLogger } from "./hooks/setupLogger";

//import { setupRoutes } from "./routes";

export const app = Fastify({
	logger: false,
	maxParamLength: 5000,
	...Config.sslOptions,
});

export interface BuildAppParams {
	resetDbOnInit: boolean;
	staticClientFilesDir: string;
}

export async function buildApp({
	resetDbOnInit,
	//staticClientFilesDir,
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

	await app.register(fastifyTRPCPlugin, {
		prefix: "/api/trpc",
		trpcOptions: {
			router: appRouter,
			createContext,
			onError({ path, error }) {
				// report to error monitoring
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		},
	} satisfies FastifyTRPCPluginOptions<AppRouter>);

	// Api Routes
	//await app.register(async (app) => setupRoutes(app), { prefix: "/api" });

	await app.register(fastifyStatic, {
		root: staticClientFilesDir,
		prefix: "/",
	});

	return app;
}
