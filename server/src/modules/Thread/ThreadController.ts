import type { FastifyReply, FastifyRequest } from "fastify";

import logger from "@/lib/logs/logger";
import { Thread } from "./ThreadModel";
import { Message } from "../Message/MessageModel";
import tokenizer from "@/lib/tokenizer";

export class ThreadController {
    /** Create a new Thread and add a system message */
    static async createThread(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user;
        //const thread = await getThreadRepo().createThread(user);
        const thread = await request.server.orm.manager.transaction(async (manager) => {
            const content = user.defaultAgent.systemMessage;
            const newMsg = await manager.save(Message, {
                role: "system",
                content,
                name: user.defaultAgent.name,
                tokenCount: tokenizer.estimateTokenCount(content),
            });

            const thread = await manager.save(Thread, {
                user,
                agent: user.defaultAgent,
            });

            thread.activeMessage = newMsg;
            thread.messages = [newMsg];

            return manager.save(Thread, thread);
        });
        reply.send(thread);
    }

    static async updateThread(request: FastifyRequest, reply: FastifyReply) {
        return reply.send("TODO");
    }

    /** Delete a thread. Cascades Messages */
    static async deleteThread(request: FastifyRequest, reply: FastifyReply) {
        const thread = request.thread;

        try {
            const deletedThread = await thread.remove();

            if (!deletedThread) {
                logger.error("Thread not found", { thread, deletedThread });
                return reply.status(500).send({
                    error: "(ThreadController.deleteThread) An error occurred while processing your request.",
                });
            }

            reply.send();
        } catch (error) {
            logger.error("Error in DELETE /thread/:threadId", { err: error });
            reply.status(500).send({
                error: "An error occurred while processing your request.",
            });
        }
    }
}
