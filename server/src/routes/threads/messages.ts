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
import { MessageFileController } from "@/modules/MessageFile/MessageFileController";

export async function setupMessagesRoute(app: FastifyInstance) {
	// POST Create Message in Thread
	app.post("/", {
		oas: { description: "Create Message in Thread.", tags: ["Message"] },
		schema: {
			body: Type.Object({ message: MessageCreateSchema }),
			response: { 200: MessageObjectSchema },
		},
		preHandler: [getThread(["activeMessage"])],
		handler: MessageController.createMessage,
	});

	// GET list of messages for a thread
	app.get("/", {
		oas: { description: "List Messages for a Thread.", tags: ["Message"] },
		schema: { response: { 200: MessageListSchema } },
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
		oas: { description: "Get Message.", tags: ["Message"] },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: async (req, res) => res.send(req.message),
	});

	// POST Modify Message
	app.post("/:messageId", {
		oas: { description: "Modify Message.", tags: ["Message"] },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: MessageController.modifyMessage,
	});

	// DELETE Message
	app.delete("/:messageId", {
		oas: { description: "Delete Message.", tags: ["Message"] },
		schema: { response: { 200: MessageSchemaWithoutId } },
		preHandler: [getMessage(["parent", "children"])],
		handler: MessageController.deleteMessage,
	});

	// POST Create a Message File
	app.post("/:messageId/files", {
		oas: { description: "Create a Message File.", tags: ["MessageFile"] },
		schema: { response: { 200: MessageObjectSchema } },
		preHandler: [getMessage()],
		handler: MessageFileController.createMessageFile,
	});

	// GET list of files for a message
	app.get("/:messageId/files", {
		oas: { description: "List Files for a Message.", tags: ["MessageFile"] },
		preHandler: [getMessage(["files"])],
		handler: MessageFileController.getMessageFiles,
	});

	// GET file by message ID
	app.get("/:messageId/files/:fileId", {
		oas: { description: "Get File by Message ID.", tags: ["MessageFile"] },
		preHandler: [getMessage({ files: { fileData: true } })],
		handler: MessageFileController.getMessageFile,
	});
}
