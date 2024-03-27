import type { FastifyInstance } from "fastify";

import logger from "@/lib/logs/logger";

import { ThreadRepo } from "@/modules/Thread/ThreadRepo";
import { getThread } from "@/middleware/getThread";
import { ThreadSchema } from "@/modules/Thread/ThreadSchema";

export const setupThreadsRoute = (app: FastifyInstance) => {
	// POST Create a new thread
	app.post("/", {
		oas: { description: "Create new Thread." },
		schema: { response: { 200: ThreadSchema } },
		handler: async (request, reply) => reply.send("TODO"),
	});

	// GET Thread by ID
	app.get("/:threadId", {
		oas: { description: "Get Thread by ID." },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: async (req, res) => res.send(req.thread),
	});

	// POST Update a thread by ID
	app.post("/:threadId", {
		oas: { description: "Update Thread by ID." },
		schema: { response: { 200: ThreadSchema } },
		preHandler: [getThread()],
		handler: async (request, reply) => reply.send("TODO"),
	});

	// DELETE Thread by ID
	app.delete("/:threadId", {
		oas: { description: "Delete Thread by ID." },
		preHandler: [getThread()],
		handler: async (req, res) => {
			const thread = req.thread;

			try {
				const deletedThread = await ThreadRepo.deleteThread(req.user, thread.id);

				if (!deletedThread) {
					return res.status(500).send({
						error: "(ThreadController.deleteThread) An error occurred while processing your request.",
					});
				}

				res.send(deletedThread);
			} catch (error) {
				logger.error("Error in DELETE /thread/:threadId", error);
				res.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}
		},
	});
};
