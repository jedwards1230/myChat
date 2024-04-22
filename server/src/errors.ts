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
        err: error,
        params: request.params,
        method: request.method,
        url: request.url,
        body: request.body,
        headers: request.headers,
    });
    return reply.status(409).send({ ok: false });
}
