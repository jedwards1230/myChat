import type { FastifyReply, FastifyRequest } from "fastify";

import type { MessageCreateSchema, Role } from "@mychat/shared/schemas/Message";

import { logger } from "@/lib/logger";
import type { Message } from "@mychat/db/entity/Message";
import { MessageFileController } from "./MessageFileController";
import { pgRepo } from "@/lib/pg";

export class MessageController {
	static async createMessage(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const message = request.body as MessageCreateSchema;

		try {
			const newMsg = await pgRepo["Thread"].addMessage(thread, {
				role: message.role as Role,
				content: message.content?.toString(),
			});

			if (!newMsg) {
				return reply.status(500).send({
					error: "Error creating message.",
				});
			}
			await newMsg.reload();
			reply.send(newMsg.toJSON?.());
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

		const updatedMessage = pgRepo["Message"].create({
			thread: { id: thread.id },
			role: message.role,
			tool_calls: message.tool_calls,
			tool_call_id: message.tool_call_id,
			files: message.files,
			tokenCount: message.tokenCount,
			content,
		});
		logger.debug("Updating message", { msg: message, updatedMessage });

		const newMsg = await pgRepo["Thread"].addMessage(
			thread,
			updatedMessage,
			message.parent?.id
		);

		await newMsg.reload();
		if (!newMsg) return reply.status(500).send({ error: "Error creating message." });

		logger.debug("Updated message", { newMsg });

		reply.send(newMsg.toJSON());
	}

	static async deleteMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message, thread } = request;

		if (thread.activeMessage?.id === message.id) {
			thread.activeMessage = message.parent;
			await thread.save();
		}

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

		const messages = (
			await pgRepo["Message"].findAncestors(thread.activeMessage, {
				relations: ["tool_calls", "tool_call_id", "files", "parent", "children"],
			})
		).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		reply.send(messages.map((msg) => msg.toJSON()));
	}

	static async injectFileContent(message: Message) {
		if (message.files && message.files.length > 0) {
			const files = await MessageFileController.parseFiles(message.files);
			message.content = `${message.content}\n${files}`;
		}
		return message;
	}

	static async injectFilesContent(messages: Message[]) {
		const parsed = messages.map(async (message) =>
			MessageController.injectFileContent(message)
		);

		return (await Promise.all(parsed)).sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
		);
	}
}
