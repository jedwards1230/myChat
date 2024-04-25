import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { getMessage } from "@/hooks/getMessage";

import {
	MessageListSchema,
	MessageObjectSchema,
	MessageCreateSchema,
	MessageSchemaWithoutId,
} from "@mychat/shared/schemas/Message";
import { MessageController } from "@/modules/Message/MessageController";
import { MessageFileController } from "@/modules/MessageFile/MessageFileController";

export async function setupMessagesRoute(app: FastifyInstance) {
	app.addHook(
		"preHandler",
		getThread({
			activeMessage: true,
			messages: { files: true },
		})
	);

	// POST Create Message in Thread
	app.post("/", {
		schema: {
			description: "Create Message in Thread.",
			tags: ["Message"],
			body: MessageCreateSchema,
			response: { 200: MessageObjectSchema },
		},
		handler: MessageController.createMessage,
	});

	// GET list of messages for a thread
	app.get("/", {
		schema: {
			description: "List Messages for a Thread.",
			tags: ["Message"],
			response: { 200: MessageListSchema },
		},
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

	await app.register(async (app) => {
		app.addHook(
			"preHandler",
			getMessage({
				parent: true,
				children: true,
				files: {
					fileData: true,
				},
			})
		);

		// PATCH Modify Message
		app.patch("/:messageId", {
			schema: {
				description: "Modify Message.",
				tags: ["Message"],
				response: { 200: MessageObjectSchema },
			},
			handler: MessageController.modifyMessage,
		});

		// DELETE Message
		app.delete("/:messageId", {
			schema: {
				description: "Delete Message.",
				tags: ["Message"],
				response: { 200: MessageSchemaWithoutId },
			},
			handler: MessageController.deleteMessage,
		});

		// POST Create a Message File
		app.post("/:messageId/files", {
			schema: {
				description: "Create a Message File.",
				tags: ["MessageFile"],
				response: { 200: MessageObjectSchema },
			},
			handler: MessageFileController.createMessageFile,
		});

		// GET list of files for a message
		app.get("/:messageId/files", {
			schema: { description: "List Files for a Message.", tags: ["MessageFile"] },
			handler: MessageFileController.getMessageFiles,
		});

		// GET file by message ID
		app.get("/:messageId/files/:fileId", {
			schema: { description: "Get File by Message ID.", tags: ["MessageFile"] },
			handler: MessageFileController.getMessageFile,
		});
	});
}
