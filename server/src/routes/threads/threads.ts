import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { ThreadSchema, ThreadListSchema } from "@/modules/Thread/ThreadSchema";
import { ThreadController } from "@/modules/Thread/ThreadController";

export async function setupThreadsRoute(app: FastifyInstance) {
	// GET Thread History for user
	app.get("/", {
		schema: { response: { 200: ThreadListSchema } },
		oas: { description: "List Threads for User.", tags: ["Thread"] },
		handler: async (request, reply) => reply.send(request.user.threads),
	});

	// POST Create a new thread
	app.post("/", {
		oas: { description: "Create new Thread.", tags: ["Thread"] },
		schema: { response: { 200: ThreadSchema } },
		handler: ThreadController.createThread,
	});

	// GET Thread by ID
	app.get("/:threadId", {
		oas: { description: "Get Thread by ID.", tags: ["Thread"] },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: async (req, res) => res.send(req.thread),
	});

	// POST Update a thread by ID
	app.post("/:threadId", {
		oas: { description: "Update Thread by ID.", tags: ["Thread"] },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: ThreadController.updateThread,
	});

	// DELETE Thread by ID
	app.delete("/:threadId", {
		oas: { description: "Delete Thread by ID.", tags: ["Thread"] },
		preHandler: [getThread()],
		handler: ThreadController.deleteThread,
	});
}
