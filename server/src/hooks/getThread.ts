import { Equal, type FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import { getThreadRepo } from "@/modules/Thread/ThreadRepo";
import type { Thread } from "@/modules/Thread/ThreadModel";
import logger from "@/lib/logs/logger";

export function getThread(relations?: FindOneOptions<Thread>["relations"]) {
    return async function getThread(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { threadId } = request.params as { threadId: string };
            const thread = await getThreadRepo().findOne({
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
