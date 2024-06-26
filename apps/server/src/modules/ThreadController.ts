import type { FastifyReply, FastifyRequest } from "fastify";

import { logger } from "@/lib/logger";
import { Thread } from "@mychat/db/entity/Thread";
import { Message } from "@mychat/db/entity/Message";
import tokenizer from "@mychat/agents/tokenizer";
import type { ThreadPatchSchema } from "@mychat/shared/schemas/Thread";
import { pgRepo } from "@/lib/pg";

export class ThreadController {
	/** Create a new Thread and add a system message */
	static async createThread(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const thread = await request.server.orm.manager.transaction(async (manager) => {
			if (!user.defaultAgent) throw new Error("User does not have a default agent");
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
		const thread = request.thread;
		const body = request.body as ThreadPatchSchema;

		if (!body) {
			return reply.status(400).send({
				error: "Invalid request body",
			});
		}

		if (body.title) {
			thread.title = body.title;
		}

		if (body.activeMessage) {
			const requestedMessage = await pgRepo["Message"].findOne({
				where: { id: body.activeMessage },
			});
			if (!requestedMessage) {
				return reply.status(404).send({
					error: "Cannot find requested activeMessage",
				});
			}

			const newBranch = await pgRepo["Message"].findDescendants(requestedMessage);
			if (!newBranch) {
				return reply.status(404).send({
					error: "Cannot find requested activeMessage branch",
				});
			}

			const newActiveMessage = newBranch[newBranch.length - 1];
			if (!newActiveMessage) {
				return reply.status(404).send({
					error: "Cannot find requested activeMessage in branch",
				});
			}

			thread.activeMessage = newActiveMessage;
		}

		const newThread = await pgRepo["Thread"].save(thread);

		return reply.send(newThread.toJSON());
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

	/** Delete all threads for a user. */
	static async deleteAllThreads(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;

		try {
			await Thread.delete({ user });
			reply.send();
		} catch (error) {
			logger.error("Error in DELETE /thread", { err: error });
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	}
}
