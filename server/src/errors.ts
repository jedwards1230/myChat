import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import logger from "./lib/logs/logger";
import { ResponseValidationError } from "fastify-type-provider-zod";
import type { ZodError } from "zod";

type ErrorType<T> = FastifyError & T;

export async function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply
) {
	switch (error.name) {
		case "RequestValidationError":
			const validationError = error as ErrorType<ResponseValidationError>;
			logger.error("Response Validation error", {
				details: validationError.details,
			});
			return reply.status(400).send(validationError.details);
		case "ZodError":
			const zodError = error as ErrorType<ZodError>;
			logger.error("Zod error", { errors: zodError.issues });
			return reply.status(400).send(zodError.issues);
	}
	logger.error("Fastify error", {
		error,
		params: request.params,
		method: request.method,
		url: request.url,
		body: request.body,
		headers: request.headers,
	});
	return reply.status(409).send({ ok: false });
}
