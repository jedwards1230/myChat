import type { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";
import { eq } from "drizzle-orm";

import type { MessageCreateSchema, Role } from "@mychat/shared/schema/message";
import { db } from "@mychat/db/client";
import { Message, Thread } from "@mychat/db/schema";

export class MessageController {
	static async createMessage(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const message = request.body as MessageCreateSchema;

		try {
			const newMsg = await pgRepo.Thread.addMessage(thread, {
				role: message.role as Role,
				content: message.content?.toString(),
			});
			await newMsg.reload();
			return reply.send(newMsg.toJSON());
		} catch (error) {
			logger.error("Error in POST /message", {
				error,
				functionName: "setupmessageRoute.post(/message)",
			});
			return reply.status(500).send(error);
		}
	}

	static async patchMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message, thread } = request;
		const { content } = request.body as { content: string };

		const updatedMessage = pgRepo.Message.create({
			thread: { id: thread.id },
			role: message.role,
			tool_calls: message.tool_calls,
			tool_call_id: message.tool_call_id,
			files: message.files,
			tokenCount: message.tokenCount,
			content,
		});
		logger.debug("Updating message", { msg: message, updatedMessage });

		const newMsg = await pgRepo.Thread.addMessage(
			thread,
			updatedMessage,
			message.parent?.id,
		);

		await newMsg.reload();

		logger.debug("Updated message", { newMsg });

		return reply.send(newMsg.toJSON());
	}

	static async deleteMessage(request: FastifyRequest, reply: FastifyReply) {
		const { message, thread } = request;

		if (thread.activeMessageId === message.id) {
			thread.activeMessageId = message.parentId;
			await db.update(Thread).set(thread);
		}

		// Reassign children to the parent of the target message
		if (message.parentId && message.childrenIds.length > 0) {
			// Find and update all children of the target message
			await Promise.all(
				message.children.map((child) => {
					child.parent = message.parent; // Set to the parent of the message being deleted
					return child.save();
				}),
			);
		}

		await db.delete(Message).where(eq(Message.id, message.id));
		return reply.send({ success: true });
	}

	static async getMessageList(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		if (!thread.activeMessageId) {
			return reply.status(500).send({
				error: "No active message found.",
			});
		}

		const messages = (
			await pgRepo.Message.findAncestors(thread.activeMessage, {
				relations: ["tool_calls", "tool_call_id", "files", "parent", "children"],
			})
		).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		return reply.send(messages.map((msg) => msg.toJSON()));
	}
}
