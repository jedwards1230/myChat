import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import logger from "@/lib/logs/logger";
import { MessageRepo } from "@/modules/Message/MessageRepo";
import type { Message } from "@/modules/Message/MessageModel";

export function getMessage(relations?: FindOneOptions<Message>["relations"]) {
	return async function getMessage(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { threadId, messageId } = request.params as {
				threadId: string;
				messageId: string;
			};

			const message = await MessageRepo.findOne({
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
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	};
}
