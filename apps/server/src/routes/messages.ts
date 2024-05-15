import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { getMessage } from "@/hooks/getMessage";

import {
	MessageListSchema,
	MessageObjectSchema,
	MessageCreateSchema,
	MessageSchemaWithoutId,
} from "@mychat/shared/schemas/Message";
import { MessageController } from "@/modules/MessageController";
import { MessageFileController } from "@/modules/MessageFileController";

export async function setupMessagesRoute(app: FastifyInstance) {
	app.addHook(
		"preHandler",
		getThread({
			activeMessage: true,
			messages: { parent: true, children: true, files: true },
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

	await app.register(async (app) => {
		app.addHook(
			"preHandler",
			getMessage({
				parent: true,
				children: true,
			})
		);

		// GET Message
		app.get("/:messageId", {
			schema: {
				description: "Get Message.",
				tags: ["Message"],
				response: { 200: MessageObjectSchema },
			},
			handler: async (req, res) => res.send(req.message),
		});

		// PATCH Message
		app.patch("/:messageId", {
			schema: {
				description: "Modify Message.",
				tags: ["Message"],
				response: { 200: MessageObjectSchema },
			},
			handler: MessageController.patchMessage,
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

			// GET list of files for a message
			app.get("/:messageId/files", {
				schema: {
					description: "List Files for a Message.",
					tags: ["MessageFile"],
				},
				handler: MessageFileController.getMessageFiles,
			});

			// GET file by message ID
			app.get("/:messageId/files/:fileId", {
				schema: { description: "Get File by Message ID.", tags: ["MessageFile"] },
				handler: MessageFileController.getMessageFile,
			});
		});
	});
}
