import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { getMessage } from "@/hooks/getMessage";

import {
	MessageListSchema,
	MessageObjectSchema,
	MessageCreateSchema,
	MessageSchemaWithoutId,
} from "@/modules/Message/MessageSchema";
import { MessageController } from "@/modules/Message/MessageController";
import { MessageFileController } from "@/modules/MessageFile/MessageFileController";

export async function setupMessagesRoute(app: FastifyInstance) {
	// POST Create Message in Thread
	app.post("/", {
		schema: {
			description: "Create Message in Thread.",
			tags: ["Message"],
			body: MessageCreateSchema,
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getThread(["activeMessage"])],
		handler: MessageController.createMessage,
	});

	// GET list of messages for a thread
	app.get("/", {
		schema: {
			description: "List Messages for a Thread.",
			tags: ["Message"],
			response: { 200: MessageListSchema },
		},
		preHandler: [
			getThread({
				activeMessage: true,
				messages: {
					files: true,
				},
			}),
		],
		handler: MessageController.getMessageList,
	});

	// GET Message
	app.get("/:messageId", {
		schema: {
			description: "Get Message.",
			tags: ["Message"],
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getMessage()],
		handler: async (req, res) => res.send(req.message),
	});

	// PATCH Modify Message
	app.patch("/:messageId", {
		schema: {
			description: "Modify Message.",
			tags: ["Message"],
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getMessage()],
		handler: MessageController.modifyMessage,
	});

	// DELETE Message
	app.delete("/:messageId", {
		schema: {
			description: "Delete Message.",
			tags: ["Message"],
			response: { 200: MessageSchemaWithoutId },
		},
		preHandler: [getMessage(["parent", "children"])],
		handler: MessageController.deleteMessage,
	});

	// POST Create a Message File
	app.post("/:messageId/files", {
		schema: {
			description: "Create a Message File.",
			tags: ["MessageFile"],
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getMessage()],
		handler: MessageFileController.createMessageFile,
	});

	// GET list of files for a message
	app.get("/:messageId/files", {
		schema: { description: "List Files for a Message.", tags: ["MessageFile"] },
		preHandler: [getMessage(["files"])],
		handler: MessageFileController.getMessageFiles,
	});

	// GET file by message ID
	app.get("/:messageId/files/:fileId", {
		schema: { description: "Get File by Message ID.", tags: ["MessageFile"] },
		preHandler: [getMessage({ files: { fileData: true } })],
		handler: MessageFileController.getMessageFile,
	});
}
