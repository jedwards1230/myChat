import type { FastifyInstance } from "fastify";
import { getMessage } from "@/hooks/getMessage";
import { getThread } from "@/hooks/getThread";
import { MessageController } from "@/modules/MessageController";

import {
	MessageCreateSchema,
	MessageListSchema,
	MessageObjectSchema,
	MessageSchemaWithoutId,
} from "@mychat/shared/schemas/Message";

export async function setupMessagesRoute(app: FastifyInstance) {
	app.addHook(
		"preHandler",
		getThread({
			activeMessage: true,
			messages: { parent: true, children: true, files: true },
		}),
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
			}),
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
				description: "Patch a Message.",
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
	});
}
