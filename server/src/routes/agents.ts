import type { FastifyInstance } from "fastify";

import {
	AgentCreateSchema,
	AgentObjectSchema,
	AgentObjectListSchema,
} from "@/modules/Agent/AgentSchema";
import { AgentController } from "@/modules/Agent/AgentController";
import { getAgent } from "@/hooks/getAgent";

export async function setupAgentsRoute(app: FastifyInstance) {
	// POST Create a new agent
	app.post("/", {
		schema: {
			description: "Create Agent.",
			tags: ["Agent"],
			body: AgentCreateSchema,
			response: { 200: AgentObjectSchema },
		},
		handler: AgentController.createAgent,
	});

	// GET Agents
	app.get("/", {
		schema: {
			description: "List Agents.",
			tags: ["Agent"],
			response: { 200: AgentObjectListSchema },
		},
		handler: AgentController.getAgents,
	});

	// GET Agent by ID
	app.get("/:agentId", {
		schema: {
			description: "Get Agent by ID.",
			tags: ["Agent"],
			response: { 200: AgentObjectSchema },
		},
		preHandler: [getAgent()],
		handler: AgentController.getAgent,
	});

	// POST Update an agent by ID
	app.post("/:agentId", {
		schema: { description: "Update Agent by ID.", tags: ["Agent"] },
		preHandler: [getAgent()],
		handler: AgentController.updateAgent,
	});

	// DELETE Agent by ID
	app.delete("/:agentId", {
		schema: { description: "Delete Agent by ID.", tags: ["Agent"] },
		preHandler: [getAgent()],
		handler: AgentController.deleteAgent,
	});
}
