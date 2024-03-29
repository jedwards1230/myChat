import type { FastifyReply, FastifyRequest } from "fastify";

import logger from "@/lib/logs/logger";
import { ThreadRepo } from "@/modules/Thread/ThreadRepo";

export class ThreadController {
	static async createThread(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const thread = await ThreadRepo.createThread(user);
		reply.send(thread);
	}

	static async updateThread(request: FastifyRequest, reply: FastifyReply) {
		return reply.send("TODO");
	}

	static async deleteThread(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;

		try {
			const deletedThread = await ThreadRepo.deleteThread(request.user, thread.id);

			if (!deletedThread) {
				return reply.status(500).send({
					error: "(ThreadController.deleteThread) An error occurred while processing your request.",
				});
			}

			reply.send(deletedThread);
		} catch (error) {
			logger.error("Error in DELETE /thread/:threadId", error);
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	}
}
