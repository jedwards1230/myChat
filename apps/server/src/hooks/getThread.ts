import type { FastifyReply, FastifyRequest } from "fastify";
import type { FindOneOptions } from "typeorm";
import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";
import { Equal } from "typeorm";

import type { Thread } from "@mychat/db/entity/Thread";

export function getThread(relations?: FindOneOptions<Thread>["relations"]) {
	return async function getThread(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { threadId } = request.params as { threadId: string };
			const thread = await pgRepo.Thread.findOne({
				where: { id: threadId, user: Equal(request.user.id) },
				relations,
				order: { lastModified: "DESC" },
			});
			if (!thread) {
				return reply.status(500).send({
					error: "(ThreadController.getThreadById) An error occurred while processing your request.",
				});
			}

			request.thread = thread;
		} catch (error: any) {
			if ("routine" in error && error.routine === "string_to_uuid") {
				return reply.status(404).send({ error: "Thread not found." });
			}
			logger.error("Error in getThread", { error, functionName: "getThread" });
			return reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	};
}
