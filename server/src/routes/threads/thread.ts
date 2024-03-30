import type { FastifyInstance } from "fastify";

import logger from "@/lib/logs/logger";
import { getThread } from "@/middleware/getThread";
import { AgentRunController } from "@/modules/AgentRun/AgentRunController";
import { ThreadListSchema } from "@/modules/Thread/ThreadSchema";

export const setupThreadRoute = (app: FastifyInstance) => {
	// GET Thread History for user
	app.get("/", {
		schema: { response: { 200: ThreadListSchema } },
		oas: { description: "List Threads for User.", tags: ["Thread-Old"] },
		handler: async (request, reply) => reply.send(request.user.threads),
	});

	// GET Thread Title by Thread ID
	app.get("/title/:threadId", {
		preHandler: [getThread()],
		oas: { description: "Get Thread Title by Thread ID.", tags: ["Thread-Old"] },
		handler: async (req, res) => res.send(req.thread.title),
	});

	// POST Thread Title by Thread ID
	app.post("/title/:threadId", {
		preHandler: [getThread(["activeMessage"])],
		oas: { description: "Generate Thread Title creation.", tags: ["Thread-Old"] },
		handler: async (req, res) => {
			try {
				const thread = req.thread;
				const runInsert = await AgentRunController.createAndRun({
					thread,
					stream: false,
					type: "getTitle",
				});

				res.send(runInsert?.raw.id);
			} catch (error) {
				logger.error("Error in POST /thread/title/:threadId", error);
				res.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}
		},
	});
};
