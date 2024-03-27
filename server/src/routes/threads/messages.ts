import type { FastifyInstance } from "fastify";
import type OpenAI from "openai";
import { Type } from "@sinclair/typebox";

import logger from "@/lib/logs/logger";
import { getThread } from "@/middleware/getThread";
import { getMessage } from "@/middleware/getMessage";

import type { Role } from "@/modules/Message/RoleModel";
import { ThreadRepo } from "@/modules/Thread/ThreadRepo";
import { MessageRepo } from "@/modules/Message/MessageRepo";
import type { MessageFile } from "@/modules/File/MessageFileModel";
import { MessageFileRepo } from "@/modules/File/MessageFileRepo";
import {
	MessageListSchema,
	MessageSchema,
	MessageSchemaWithoutId,
} from "@/modules/Message/MessageSchema";

const ThreadIdSchema = Type.Object({
	threadId: Type.String(),
});

export const setupMessagesRoute = (app: FastifyInstance) => {
	// POST Create Message in Thread
	app.post("/", {
		oas: { description: "Create Message in Thread." },
		schema: { response: { 200: Type.Intersect([ThreadIdSchema, MessageSchema]) } },
		handler: async (request, reply) => {
			try {
				const opts: any = {
					messageJSON: "",
					threadId: "",
					filesRaw: [],
				};

				const parts = request.parts();
				for await (const part of parts) {
					logger.debug("part", {
						part,
						functionName: "setupmessageRoute.post(/message)",
					});
					if (part.type === "file") {
						opts.filesRaw.push(part);
					} else {
						opts[part.fieldname] = part.value;
					}
				}

				const { message: messageJSON, threadId, filesRaw } = opts;

				const message = JSON.parse(
					messageJSON
				) as OpenAI.ChatCompletionMessageParam;

				const thread = await ThreadRepo.getOrCreateThread(request.user, threadId);
				if (!thread) {
					return reply
						.status(500)
						.send(
							"(ThreadController.getThreadById) An error occurred while processing your request."
						);
				}

				let files: MessageFile[] | undefined;
				if (filesRaw) {
					const foundFiles = await MessageFileRepo.addFileList(filesRaw);
					if (foundFiles.length > 0) {
						files = foundFiles;
					}
				}

				const newMessage = MessageRepo.create({
					role: message.role as Role,
					content: message.content?.toString(),
					files,
				});

				const newThread = await ThreadRepo.addMessage(thread, newMessage);

				reply.send({ ...newThread.activeMessage, threadId: newThread.id });
			} catch (error) {
				logger.error("Error in POST /message", {
					error,
					functionName: "setupmessageRoute.post(/message)",
				});
				reply.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}
		},
	});

	// GET list of messages for a thread
	app.get("/", {
		oas: { description: "List Messages for a Thread." },
		schema: { response: { 200: MessageListSchema } },
		preHandler: [getThread(["activeMessage"])],
		handler: async (req, res) => {
			const thread = req.thread;
			if (!thread.activeMessage) {
				return res.status(500).send({
					error: "No active message found.",
				});
			}

			const messages = await MessageRepo.getMessageHistoryList(
				thread.activeMessage
			);

			res.send(messages);
		},
	});

	// GET list of files for a message
	app.get("/:messageId/files", {
		oas: { description: "List Files for a Message." },
		preHandler: [getMessage(["files"])],
		handler: async (req, res) => {
			const message = req.message;
			if (!message.files) {
				return res.status(500).send({
					error: "No message files found.",
				});
			}

			res.send(message.files);
		},
	});

	// GET file by message ID
	app.get("/:messageId/files/:fileId", {
		oas: { description: "Get File by Message ID." },
		preHandler: [getMessage(["files"])],
		handler: async (req, res) => {
			const { fileId } = req.params as {
				fileId: string;
			};
			const message = req.message;
			if (!message.files) {
				return res.status(500).send({
					error: "No message files found.",
				});
			}

			const file = message.files.find((f) => f.id === fileId);
			if (!file) {
				return res.status(404).send({
					error: "File not found.",
				});
			}

			res.send(file);
		},
	});

	// GET message
	app.get("/messageId", {
		oas: { description: "Get Message." },
		schema: { response: { 200: MessageSchema } },
		preHandler: [getMessage()],
		handler: async (req, res) => res.send(req.message),
	});

	// POST Modify Message
	app.post("/:messageId", {
		oas: { description: "Modify Message." },
		schema: { response: { 200: MessageSchema } },
		preHandler: [getMessage()],
		handler: async (req, res) => {
			const { message } = req;
			const { content } = req.body as { content: string };

			message.content = content;
			await message.save();

			res.send(message);
		},
	});

	// DELETE Message
	app.delete("/:messageId", {
		oas: { description: "Delete Message." },
		schema: { response: { 200: MessageSchemaWithoutId } },
		preHandler: [getThread(), getMessage(["parent", "children"])],
		handler: async (req, res) => {
			const { message } = req;

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
			res.send(msg);
		},
	});
};
