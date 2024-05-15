import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import type { ResponseValidationError } from "fastify-type-provider-zod";
import type { ZodError } from "zod";

import { logger, accessLogger as aLogger } from "@/lib/logger";

type ErrorType<T> = FastifyError & T;

export const setupLogger = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("onRequest", async (request: FastifyRequest) => {
		aLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
		logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`);
	});

	app.addHook("onSend", async (request: FastifyRequest, reply: FastifyReply) => {
		if (reply.statusCode >= 400) {
			logger.error(`Error: ${reply.statusCode} ${request.method} ${request.url}`);
		}
	});

	app.setErrorHandler(
		async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
			logger.warn(`Error handler Status Code: ${error.statusCode || "undefined"}`);
			if (error.statusCode === 429) {
				error.message = "You hit the rate limit! Slow down please!";
				return reply.code(429).send(error);
			}

			switch (error.name) {
				case "RequestValidationError": {
					const err = error as ErrorType<ResponseValidationError>;
					logger.error("Request Validation error", {
						details: err.details,
					});
					return reply.status(400).send(err.details);
				}
				case "ResponseValidationError": {
					const err = error as ErrorType<ResponseValidationError>;
					logger.error("Response Validation error", {
						details: err.details,
					});
					return reply.status(400).send(err.details);
				}
				case "ZodError": {
					const err = error as ErrorType<ZodError>;
					logger.error("Zod error", { errors: err.issues });
					return reply.status(400).send(err.issues);
				}
			}
			logger.error("Fastify error", {
				error,
				...error,
				params: request.params,
				method: request.method,
				url: request.url,
			});
			return reply.status(409).send(error);
		}
	);
});
