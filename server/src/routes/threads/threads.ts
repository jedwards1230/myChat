import type { FastifyInstance } from "fastify";

import { getThread } from "@/middleware/getThread";
import { ThreadSchema, ThreadController } from "@/modules/Thread";

export const setupThreadsRoute = (app: FastifyInstance) => {
	// GET Thread by ID
	app.get("/:threadId", {
		oas: { description: "Get Thread by ID." },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: async (req, res) => res.send(req.thread),
	});

	// POST Create a new thread
	app.post("/", {
		oas: { description: "Create new Thread." },
		schema: { response: { 200: ThreadSchema } },
		handler: ThreadController.createThread,
	});

	// POST Update a thread by ID
	app.post("/:threadId", {
		oas: { description: "Update Thread by ID." },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: ThreadController.updateThread,
	});

	// DELETE Thread by ID
	app.delete("/:threadId", {
		oas: { description: "Delete Thread by ID." },
		preHandler: [getThread()],
		handler: ThreadController.deleteThread,
	});
};
