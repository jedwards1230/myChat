import type { FastifyInstance } from "fastify";

import {
	AgentCreateSchema,
	AgentObjectSchema,
	AgentObjectListSchema,
	AgentUpdateSchema,
} from "@mychat/shared/schemas/Agent";
import { AgentToolSchema } from "@mychat/shared/schemas/AgentTool";
import { AgentController } from "@/modules/AgentController";
import { getAgent } from "@/hooks/getAgent";
import { AgentToolController } from "@/modules/AgentToolController";

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

	await app.register(async (app) => {
		app.addHook(
			"preHandler",
			getAgent({
				threads: {
					messages: { parent: true, children: true },
				},
				owner: true,
			})
		);

		// GET Agent by ID
		app.get("/:agentId", {
			schema: {
				description: "Get Agent by ID.",
				tags: ["Agent"],
				response: { 200: AgentObjectSchema },
			},
			handler: AgentController.getAgent,
		});

		// PATCH Update an agent by ID
		app.patch("/:agentId", {
			schema: {
				description: "Update Agent by ID.",
				tags: ["Agent"],
				body: AgentUpdateSchema,
				response: { 200: AgentObjectSchema },
			},
			handler: AgentController.updateAgent,
		});

		// DELETE Agent by ID
		app.delete("/:agentId", {
			schema: { description: "Delete Agent by ID.", tags: ["Agent"] },
			handler: AgentController.deleteAgent,
		});

		await app.register(async (app) => {
			// GET Agent by ID
			app.get("/:agentId/tool/:toolId", {
				schema: {
					description: "Get Agent Tool by ID.",
					tags: ["Agent Tool"],
					response: { 200: AgentToolSchema },
				},
				handler: AgentToolController.getAgentTool,
			});

			// PATCH Update an agent by ID
			app.patch("/:agentId/tool/:toolId", {
				schema: {
					description: "Update Agent Tool by ID.",
					tags: ["Agent Tool"],
					body: AgentUpdateSchema,
					response: { 200: AgentToolSchema },
				},
				handler: AgentToolController.updateAgentTool,
			});

			// DELETE Agent by ID
			app.delete("/:agentId/tool/:toolId", {
				schema: { description: "Delete Agent Tool by ID.", tags: ["Agent Tool"] },
				handler: AgentToolController.deleteAgentTool,
			});
		});
	});

	// GET list of available tools
	app.get("/tools", {
		schema: {
			description: "List available tools for an agent.",
			tags: ["Agent"],
		},
		handler: AgentController.getTools,
	});
}
