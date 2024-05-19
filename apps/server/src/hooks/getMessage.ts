import type { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";

import type { Message } from "@mychat/db/schema/Message";

export function getMessage(relations?: FindOneOptions<Message>["relations"]) {
	return async function getMessage(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { threadId, messageId } = request.params as {
				threadId: string;
				messageId: string;
			};

			const message = await pgRepo.Message.findOne({
				where: { id: messageId, thread: { id: threadId } },
				relations,
			});
			if (!message) {
				return reply.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}

			request.message = message;
		} catch (error) {
			logger.error("Error in getMessage", {
				error,
				functionName: "getMessage",
			});
			return reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	};
}
