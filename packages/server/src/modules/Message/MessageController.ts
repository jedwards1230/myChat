import type { FastifyReply, FastifyRequest } from "fastify";

import type { MessageCreateSchema } from "@mychat/shared/schemas/Message";

import logger from "@/lib/logs/logger";
import { getThreadRepo } from "@/modules/Thread/ThreadRepo";
import type { Role } from "./RoleModel";
import { getMessageRepo } from "./MessageRepo";
import { Message } from "./MessageModel";

export class MessageController {
	static async createMessage(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const message = request.body as MessageCreateSchema;

		try {
			const { newMsg } = await getThreadRepo().addMessage(thread, {
				role: message.role as Role,
				content: message.content?.toString(),
			});

			await newMsg.reload();
			if (!newMsg) {
				return reply.status(500).send({
					error: "Error creating message.",
				});
			}

			reply.send(newMsg.toJSON());
		} catch (error) {
			logger.error("Error in POST /message", {
				error,
				functionName: "setupmessageRoute.post(/message)",
			});
			reply.status(500).send(error);
		}
	}

	static async patchMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message, thread } = request;
		const { content } = request.body as { content: string };

		const repo = request.server.orm.getTreeRepository(Message);
		const updatedMessage = repo.create({
			...message,
			content,
			parent: message.parent,
		});

		await repo.save(updatedMessage);

		thread.activeMessage = updatedMessage;
		await thread.save();

		reply.send(updatedMessage.toJSON());
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
		reply.send(msg.toJSON());
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

		reply.send(messages.map((msg) => msg.toJSON()));
	}
}
