import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { CreateRunBody } from "@mychat/shared/schemas/AgentRun";
import { AgentRunController } from "@/modules/AgentRun/AgentRunController";

export async function setupAgentRunsRoute(app: FastifyInstance) {
	app.addHook(
		"preHandler",
		getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		})
	);

	// POST Create Thread and Run
	app.post("/runs", {
		schema: {
			description: "Create Thread and Run.",
			tags: ["Run"],
			body: CreateRunBody,
		},
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Create Run for Thread
	app.post("/:threadId/runs", {
		schema: { description: "Create a run.", tags: ["Run"], body: CreateRunBody },
		handler: AgentRunController.createAndRunHandler,
	});

	// GET List of Runs for Thread
	app.get("/:threadId/runs", {
		schema: { description: "List of Runs for a Thread.", tags: ["Run"] },
		handler: (req, rep) => rep.send("TODO"),
	});

	// GET Get Run for Thread
	app.get("/:threadId/runs/:runId", {
		schema: { description: "Get Run for Thread.", tags: ["Run"] },
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Modify a Run
	app.post("/:threadId/runs/:runId", {
		schema: { description: "Modify Run for Thread.", tags: ["Run"] },
		handler: (req, rep) => rep.send("TODO"),
	});

	// POST Cancel a Run
	app.post("/:threadId/runs/:runId/cancel", {
		schema: { description: "Cancel a Run for Thread.", tags: ["Run"] },
		handler: (req, rep) => rep.send("TODO"),
	});
}
