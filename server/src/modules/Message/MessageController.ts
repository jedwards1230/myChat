import type { FastifyReply, FastifyRequest } from "fastify";

import logger from "@/lib/logs/logger";
import { getThreadRepo } from "@/modules/Thread/ThreadRepo";
import type { Role } from "./RoleModel";
import { getMessageRepo } from "./MessageRepo";
import type { MessageCreateSchema } from "./MessageSchema";

export class MessageController {
	static async createMessage(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const message = request.body as MessageCreateSchema;

		try {
			const newThread = await getThreadRepo().addMessage(thread, {
				role: message.role as Role,
				content: message.content?.toString(),
			});

			reply.send(newThread.activeMessage);
		} catch (error) {
			logger.error("Error in POST /message", {
				error,
				functionName: "setupmessageRoute.post(/message)",
			});
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	}

	static async modifyMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message } = request;
		const { content } = request.body as { content: string };

		message.content = content;
		await message.save();

		reply.send(message);
	}

	static async deleteMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message } = request;

		// Reassign children to the parent of the target message
		if (message.parent) {
			// Find and update all children of the target message
			await Promise.all(
				message.children.map((child) => {
					child.parent = message.parent; // Set to the parent of the message being deleted
					return child.save();
				})
			);
		}

		const msg = await message.remove();
		reply.send(msg);
	}

	static async getMessageList(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		if (!thread.activeMessage) {
			return reply.status(500).send({
				error: "No active message found.",
			});
		}

		const messages = await getMessageRepo().getMessageHistoryList(
			thread.activeMessage
		);

		reply.send(messages);
	}
}
