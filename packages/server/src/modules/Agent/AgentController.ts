import type { FastifyReply, FastifyRequest } from "fastify";

import { Agent } from "./AgentModel";
import { AgentTool } from "../AgentTool/AgentToolModel";
import { Tools } from "@mychat/shared/tools/index";
import type { AgentCreateSchema, AgentUpdateSchema } from "@mychat/shared/schemas/Agent";

export class AgentController {
	static async createAgent(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const agent = request.body as AgentCreateSchema;
		const savedAgent = await request.server.orm.getRepository(Agent).save({
			...agent,
			owner: { id: user.id },
		});
		reply.send(savedAgent);
	}

	static async getAgents(request: FastifyRequest, reply: FastifyReply) {
		reply.send(request.user.agents);
	}

	static async getAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send({
			...request.agent,
			threads: request.agent.threads.map((thread) => thread.id),
			owner: request.agent.owner.id,
		});
	}

	static async updateAgent(request: FastifyRequest, reply: FastifyReply) {
		const agentUpdate = request.body as AgentUpdateSchema;
		const agent = request.agent;

		switch (agentUpdate.type) {
			case "tools": {
				const newTools = await request.server.orm
					.getRepository(AgentTool)
					.save(agentUpdate.value);

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
		reply.send({
			...updatedAgent,
			threads: updatedAgent.threads.map((thread) => thread.id),
			owner: updatedAgent.owner.id,
		});
	}

	static async deleteAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send("TODO");
	}

	/** Return list of all tools available on the server */
	static async getTools(request: FastifyRequest, reply: FastifyReply) {
		reply.send(Tools.map((tool) => tool.name));
	}
}
