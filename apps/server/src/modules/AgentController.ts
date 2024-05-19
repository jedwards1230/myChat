import type { FastifyReply, FastifyRequest } from "fastify";
import { pgRepo } from "@/lib/pg";

import type { AgentCreateSchema, AgentUpdateSchema } from "@mychat/shared/schemas/Agent";
import { Tools } from "@mychat/agents/tools/index";

export class AgentController {
	static async createAgent(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const agent = request.body as AgentCreateSchema;
		const savedAgent = await pgRepo.Agent.save({
			...agent,
			owner: { id: user.id },
		});
		return reply.send(savedAgent);
	}

	static async getAgents(request: FastifyRequest, reply: FastifyReply) {
		return reply.send(request.user.agents);
	}

	static async getAgent(request: FastifyRequest, reply: FastifyReply) {
		return reply.send(request.agent.toJSON());
	}

	static async updateAgent(request: FastifyRequest, reply: FastifyReply) {
		const agentUpdate = request.body as AgentUpdateSchema;
		const agent = request.agent;

		switch (agentUpdate.type) {
			case "tools": {
				const newTools = await pgRepo.AgentTool.save(agentUpdate.value);

				agent.tools = newTools;
				break;
			}
			case "toolsEnabled": {
				agent[agentUpdate.type] = agentUpdate.value;
				break;
			}
			case "model": {
				agent[agentUpdate.type] = agentUpdate.value;
				break;
			}
			case "name":
			case "systemMessage": {
				agent[agentUpdate.type] = agentUpdate.value;
				break;
			}
		}
		const updatedAgent = await agent.save();
		return reply.send(updatedAgent.toJSON());
	}

	static async deleteAgent(request: FastifyRequest, reply: FastifyReply) {
		return reply.send("TODO");
	}

	/** Return list of all tools available on the server */
	static async getTools(request: FastifyRequest, reply: FastifyReply) {
		return reply.send(Tools.map((tool) => tool.name));
	}
}
