import type { FastifyInstance } from "fastify";
import { Type } from "@fastify/type-provider-typebox";

import { getThread } from "@/middleware/getThread";
import { getMessage } from "@/middleware/getMessage";

import {
	MessageListSchema,
	MessageObjectSchema,
	MessageCreateSchema,
	MessageSchemaWithoutId,
} from "@/modules/Message/MessageSchema";
import { MessageController } from "@/modules/Message/MessageController";
import { MessageFileController } from "@/modules/File/MessageFileController";

export const setupMessagesRoute = (app: FastifyInstance) => {
	// POST Create Message in Thread
	app.post("/", {
		oas: { description: "Create Message in Thread." },
		schema: {
			body: Type.Object({ message: MessageCreateSchema }),
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getThread(["activeMessage"])],
		handler: MessageController.createMessage,
	});

	// GET list of messages for a thread
	app.get("/", {
		oas: { description: "List Messages for a Thread." },
		schema: { response: { 200: MessageListSchema } },
		preHandler: [getThread(["activeMessage"])],
		handler: MessageController.getMessageList,
	});

	// GET message
	app.get("/:messageId", {
		oas: { description: "Get Message." },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: async (req, res) => res.send(req.message),
	});

	// POST Modify Message
	app.post("/:messageId", {
		oas: { description: "Modify Message." },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: MessageController.modifyMessage,
	});

	// DELETE Message
	app.delete("/:messageId", {
		oas: { description: "Delete Message." },
		schema: { response: { 200: MessageSchemaWithoutId } },
		preHandler: [getMessage(["parent", "children"])],
		handler: MessageController.deleteMessage,
	});

	// POST Create a Message File
	app.post("/:messageId/files", {
		oas: { description: "Create a Message File." },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: MessageFileController.createMessageFile,
	});

	// GET list of files for a message
	app.get("/:messageId/files", {
		oas: { description: "List Files for a Message." },
		preHandler: [getMessage(["files"])],
		handler: MessageFileController.getMessageFiles,
	});

	// GET file by message ID
	app.get("/:messageId/files/:fileId", {
		oas: { description: "Get File by Message ID." },
		preHandler: [getMessage(["files"])],
		handler: MessageFileController.getMessageFile,
	});
};
