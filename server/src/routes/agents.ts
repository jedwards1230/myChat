import type { FastifyInstance } from "fastify";

import {
	AgentCreateSchema,
	AgentObjectSchema,
	AgentObjectListSchema,
	AgentController,
} from "@/modules/Agent";
import { getAgent } from "@/middleware/getAgent";

export const setupAgentsRoute = (app: FastifyInstance) => {
	// POST Create a new agent
	app.post("/", {
		oas: { description: "Create Agent." },
		schema: {
			body: AgentCreateSchema,
			response: { 200: AgentObjectSchema },
		},
		handler: AgentController.createAgent,
	});

	// GET Agents
	app.get("/", {
		schema: { response: { 200: AgentObjectListSchema } },
		oas: { description: "List Agents." },
		handler: AgentController.getAgents,
	});

	// GET Agent by ID
	app.get("/:agentId", {
		schema: { response: { 200: AgentObjectSchema } },
		oas: { description: "Get Agent by ID." },
		preHandler: [getAgent()],
		handler: AgentController.getAgent,
	});

	// POST Update an agent by ID
	app.post("/:agentId", {
		oas: { description: "Update Agent by ID." },
		preHandler: [getAgent()],
		handler: AgentController.updateAgent,
	});

	// DELETE Agent by ID
	app.delete("/:agentId", {
		oas: { description: "Delete Agent by ID." },
		preHandler: [getAgent()],
		handler: AgentController.deleteAgent,
	});
};
