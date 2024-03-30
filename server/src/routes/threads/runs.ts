import type { FastifyInstance } from "fastify";

import { getThread } from "@/middleware/getThread";
import { CreateRunBody } from "@/modules/AgentRun/AgentRunSchema";
import { AgentRunController } from "@/modules/AgentRun/AgentRunController";

export const setupAgentRunsRoute = async (app: FastifyInstance) => {
	// POST Create Thread and Run
	app.post("/runs", {
		schema: { body: CreateRunBody },
		oas: { description: "Create Thread and Run.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Create Run for Thread
	app.post("/:threadId/runs", {
		schema: { body: CreateRunBody },
		oas: { description: "Create a run.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: AgentRunController.createAndRunHandler,
	});

	// GET List of Runs for Thread
	app.get("/:threadId/runs", {
		oas: { description: "List of Runs for a Thread.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: (req, rep) => rep.send("TODO"),
	});

	// GET Get Run for Thread
	app.get("/:threadId/runs/:runId", {
		oas: { description: "Get Run for Thread.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Modify a Run
	app.post("/:threadId/runs/:runId", {
		oas: { description: "Modify Run for Thread.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Cancel a Run
	app.post("/:threadId/runs/:runId/cancel", {
		oas: { description: "Cancel a Run for Thread.", tags: ["Run"] },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: (req, rep) => rep.send("TODO"),
	});
};
