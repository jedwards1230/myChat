import type { FastifyReply, FastifyRequest } from "fastify";

import type { AgentCreateSchema, AgentUpdateSchema } from "./AgentSchema";
import { Agent } from "./AgentModel";
import { tools } from "../LLMNexus/Tools";

export class AgentController {
	static async createAgent(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const agent = request.body as AgentCreateSchema;
		const savedAgent = await request.server.orm.getRepository(Agent).save({
			...(agent as Agent),
			owner: user,
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
			case "name":
				agent.name = agentUpdate.value;
				break;
			case "tools":
				//agent.tools = agentUpdate.value;
				break;
			case "toolsEnabled":
				agent.toolsEnabled = agentUpdate.value;
				break;
			case "systemMessage":
				agent.systemMessage = agentUpdate.value;
				break;
		}
		const updatedAgent = await agent.save();
		reply.send(updatedAgent);
	}

	static async deleteAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send("TODO");
	}

	static async getTools(request: FastifyRequest, reply: FastifyReply) {
		reply.send(tools.map((tool) => tool.name));
	}
}
