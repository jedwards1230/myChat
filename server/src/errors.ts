import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import logger from "./lib/logs/logger";
import { ResponseValidationError } from "fastify-type-provider-zod";

export async function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply
) {
	if (error.name === "ResponseValidationError") {
		logger.error("Response Validation error", {
			details: (error as unknown as ResponseValidationError).details,
		});
		return reply.status(400).send({ ok: false });
	}
	logger.error("Fastify error", {
		...error,
		params: request.params,
		method: request.method,
		url: request.url,
		body: request.body,
		headers: request.headers,
	});
	return reply.status(409).send({ ok: false });
}
