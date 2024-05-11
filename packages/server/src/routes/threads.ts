import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import {
	ThreadSchema,
	ThreadListSchema,
	ThreadPatchSchema,
} from "@mychat/shared/schemas/Thread";
import { ThreadController } from "@/modules/Thread/ThreadController";

export async function setupThreadsRoute(app: FastifyInstance) {
	app.get("/", {
		schema: {
			description: "List Threads for User.",
			tags: ["Thread"],
			response: { 200: ThreadListSchema },
		},
		handler: async (request, reply) =>
			reply.send(request.user.threads.map((t) => t.toJSON())),
	});

	app.post("/", {
		schema: {
			description: "Create new Thread.",
			tags: ["Thread"],
			response: { 200: ThreadSchema },
		},
		handler: ThreadController.createThread,
	});

	app.delete("/", {
		schema: { description: "Delete all Threads for User.", tags: ["Thread"] },
		handler: ThreadController.deleteAllThreads,
	});

	await app.register(async (app) => {
		app.addHook(
			"preHandler",
			getThread({
				activeMessage: true,
				messages: { parent: true, children: true },
			})
		);

		app.get("/:threadId", {
			schema: {
				description: "Get Thread by ID.",
				tags: ["Thread"],
				response: { 200: ThreadSchema },
			},
			handler: async (req, res) => res.send(req.thread.toJSON()),
		});

		app.patch("/:threadId", {
			schema: {
				description: "Patch Thread by ID.",
				tags: ["Thread"],
				body: ThreadPatchSchema,
				response: { 200: ThreadSchema },
			},
			handler: ThreadController.updateThread,
		});

		app.delete("/:threadId", {
			schema: { description: "Delete Thread by ID.", tags: ["Thread"] },
			handler: ThreadController.deleteThread,
		});
	});
}
