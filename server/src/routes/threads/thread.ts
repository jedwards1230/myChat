import type { FastifyInstance } from "fastify";

import logger from "@/lib/logs/logger";
import { getThread } from "@/middleware/getThread";
import { AgentRunController } from "@/modules/AgentRun";
import { ThreadListSchema } from "@/modules/Thread";

export const setupThreadRoute = (app: FastifyInstance) => {
	// GET Thread History for user
	app.get("/", {
		schema: { response: { 200: ThreadListSchema } },
		handler: async (request, reply) => reply.send(request.user.threads),
	});

	// GET Thread Title by Thread ID
	app.get("/title/:threadId", {
		preHandler: [getThread()],
		handler: async (req, res) => res.send(req.thread.title),
	});

	// POST Thread Title by Thread ID
	app.post("/title/:threadId", {
		preHandler: [getThread(["activeMessage"])],
		handler: async (req, res) => {
			try {
				const thread = req.thread;
				const title = await AgentRunController.generateTitle(thread);
				if (!title) {
					return res.status(500).send({
						error: "(OpenAIService.createTitleFromChatHistory) An error occurred while processing your request.",
					});
				}

				res.send(title);
			} catch (error) {
				logger.error("Error in POST /thread/title/:threadId", error);
				res.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}
		},
	});
};
