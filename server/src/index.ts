import path from "path";
import readline from "readline";
import WebSocket from "ws";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyOpenApi from "@eropple/fastify-openapi3";

import type { OAS3PluginOptions } from "@eropple/fastify-openapi3";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { initDb, resetDatabase } from "./lib/pg";
import logger, { accessLogger } from "./lib/logs/logger";
import { WebSocketHandler } from "./lib/ws";
import { init } from "./lib/utils";
import { authenticate } from "./middleware/auth";

import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupThreadRoute } from "./routes/threads/thread";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";
import { setupAgentRunsRoute } from "./routes/threads/runs";

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
await app.register(fastifyCors, { origin: "*" });
//await app.register(fastifySocket);
await app.register(fastifyMultipart);

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

await app.register(fastifyOpenApi, { ...pluginOpts });

// Access Logger
app.addHook("onRequest", (request, reply, done) => {
	accessLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
	logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`, {
		functionName: "onRequest",
	});
	done();
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

// Static Files
if (process.env.NODE_ENV === "production") {
	await app.register(require("@fastify/static"), {
		root: CLIENT_BUILD_DIR,
		prefix: "/",
		decorateReply: false,
	});
}

// Api Routes
await app.register(
	async (app, opts) => {
		// User Route
		await app.register(async (app, opts) => setupUserRoute(app));

		// Socket Route
		//await app.register(async (app, opts) => setupWsRoute(app));

		// Authenticated Routes
		await app.register(async (app, opts) => {
			app.addHook("preHandler", authenticate);

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

			// Threads Route
			await app.register(
				async (app, opts) => {
					setupThreadsRoute(app);
					setupThreadRoute(app);
				},
				{ prefix: "/threads" }
			);

			// AgentRun Route
			await app.register(async (app, opts) => setupAgentRunsRoute(app), {
				prefix: "/threads",
			});

			// Messages Route
			await app.register(async (app, opts) => setupMessagesRoute(app), {
				prefix: "threads/:threadId/messages",
			});

			// Agents Route
			await app.register(async (app, opts) => setupAgentsRoute(app), {
				prefix: "/agents",
			});
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

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
	if (key.ctrl && key.name === "c") {
		process.exit(); // Exit the process when Ctrl+C is pressed
	} else if (key.name === "c") {
		console.clear(); // Clear the console when 'c' is pressed
	}
});

export { app, wsHandler };
