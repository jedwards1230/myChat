import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { getMessage } from "@/hooks/getMessage";

import { MessageObjectSchema } from "@mychat/shared/schemas/Message";
import { MessageFileController } from "@/modules/MessageFileController";

export async function setupMessageFilesRoute(app: FastifyInstance) {
	app.addHook(
		"preHandler",
		getThread({
			activeMessage: true,
			messages: { parent: true, children: true, files: true },
		})
	);

	await app.register(async (app) => {
		app.addHook("preHandler", getMessage({ parent: true, children: true }));

		// POST Create a Message File
		app.post("/", {
			schema: {
				description: "Create a Message File.",
				tags: ["MessageFile"],
				response: { 200: MessageObjectSchema },
			},
			handler: MessageFileController.createMessageFile,
		});
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
		app.get("/", {
			schema: {
				description: "List Files for a Message.",
				tags: ["MessageFile"],
			},
			handler: MessageFileController.getMessageFiles,
		});

		// GET file by message ID
		app.get("/:fileId", {
			schema: { description: "Get File by Message ID.", tags: ["MessageFile"] },
			handler: MessageFileController.getMessageFile,
		});
	});
}
