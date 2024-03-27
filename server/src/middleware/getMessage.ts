import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import logger from "@/lib/logs/logger";
import type { Message } from "@/modules/Message/MessageModel";
import { MessageRepo } from "@/modules/Message/MessageRepo";

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
			// error for missing item in db
			logger.error("Error in getThread", {
				error,
				functionName: "getThread",
			});
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	};
}
