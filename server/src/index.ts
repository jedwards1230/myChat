import "reflect-metadata";

import path from "path";
import WebSocket from "ws";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import OAS3Plugin, { type OAS3PluginOptions } from "@eropple/fastify-openapi3";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { initDb, resetDatabase } from "./lib/pg";
import logger, { accessLogger } from "./lib/logs/logger";
import { WebSocketHandler } from "./lib/ws";
import { init } from "./lib/utils";
import { authenticate } from "./middleware/auth";

import { setupChatRoute } from "./routes/chat";
import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupThreadRoute } from "./routes/threads/thread";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";

const _clientBuildDir = process.env.CLIENT_BUILD_DIR || "../client/dist";
const CLIENT_BUILD_DIR = path.join(process.cwd(), _clientBuildDir);

// ssl
const SSL_ENABLED = process.env.SSL_ENABLED === "true";

const SSL_DIR = path.join(process.cwd(), "ssl");
const SSL_KEY_PATH = path.join(SSL_DIR, "key.pem");
const SSL_CERT_PATH = path.join(SSL_DIR, "cert.pem");

const SSL_KEY = SSL_ENABLED ? SSL_KEY_PATH : undefined;
const SSL_CERT = SSL_ENABLED ? SSL_CERT_PATH : undefined;

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const options = {
	key: SSL_KEY,
	cert: SSL_CERT,
};

// Connect to Postgres and initialize TypeORM
await initDb();
await init();

const app = Fastify({
	logger: false,
	...options,
}).withTypeProvider<TypeBoxTypeProvider>();

// Middleware
await app.register(cors, {
	origin: "*",
	exposedHeaders: ["X-Thread-Id"],
});
await app.register(multipart);

const pluginOpts: OAS3PluginOptions = {
	openapiInfo: {
		title: "myChat API",
		version: "0.1.0",
	},
	publish: {
		ui: "rapidoc",
		json: true,
	},
};

await app.register(OAS3Plugin, { ...pluginOpts });

// Access Logger
app.addHook("onRequest", (request, reply, done) => {
	accessLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
	logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`, {
		functionName: "onRequest",
	});
	done();
});

app.setErrorHandler(function (error, request, reply) {
	logger.error(error);
	reply.status(409).send({ ok: false });
});

// Static Files
if (process.env.NODE_ENV === "production") {
	await app.register(fastifyStatic, {
		root: CLIENT_BUILD_DIR,
		prefix: "/",
		decorateReply: false,
	});
}

// Api Routes
await app.register(
	async (fastify, opts) => {
		// User Route
		await fastify.register(async (fastify, opts) => setupUserRoute(fastify));

		// Authenticated Routes
		await fastify.register(async (fastify, opts) => {
			fastify.addHook("preHandler", authenticate);

			fastify.get(
				"/reset",
				{
					oas: { description: "Reset the database" },
				},
				async (req, res) => {
					await resetDatabase();
					await initDb();
					await init();
					res.send({ ok: true });
				}
			);

			// Threads Route
			await fastify.register(
				async (fastify, opts) => {
					setupThreadsRoute(fastify);
					setupThreadRoute(fastify);

					// Messages Route
					await fastify.register(
						async (fastify, opts) => setupMessagesRoute(fastify),
						{ prefix: "/:threadId/messages" }
					);
				},
				{ prefix: "/threads" }
			);

			// Agents Route
			await fastify.register(async (fastify, opts) => setupAgentsRoute(fastify), {
				prefix: "/agents",
			});

			setupChatRoute(fastify);
		});
	},
	{ prefix: "/api" }
);

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
	logger.info(`Server is running at ${address}`);
	logger.info(`JSON: ${address}/openapi.json`);
	logger.info(`UI:   ${address}/docs`);
});

const wssHttp = new WebSocket.Server({ server: app.server });

const wsHandler = new WebSocketHandler();
wsHandler.addListener(wssHttp);

export { app, wsHandler };
