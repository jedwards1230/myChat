import logger, { accessLogger as aLogger } from "@/lib/logs/logger";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function accessLogger(request: FastifyRequest) {
    aLogger.info(`${request.headers.referer} ${request.method} ${request.url}`);
    logger.info(`Req: ${request.headers.referer} ${request.method} ${request.url}`);
}

export async function accessErrorLogger(request: FastifyRequest, reply: FastifyReply) {
    if (reply.statusCode >= 400) {
        logger.error(`Error: ${reply.statusCode} ${request.method} ${request.url}`);
    }
}
