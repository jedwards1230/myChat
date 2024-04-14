import type { FastifyReply, FastifyRequest } from "fastify";

import { getAgentRepo } from "./AgentRepo";
import type { AgentCreateSchema } from "./AgentSchema";
import type { Agent } from "./AgentModel";
import { tools } from "../LLMNexus/Tools";

export class AgentController {
	static async createAgent(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const agent = request.body as AgentCreateSchema;
		const savedAgent = await getAgentRepo().save({
			...(agent as Agent),
			owner: user,
		});
		reply.send(savedAgent);
	}

	static async getAgents(request: FastifyRequest, reply: FastifyReply) {
		reply.send(request.user.agents);
	}

	static async getAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send(request.agent);
	}

	static async updateAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send("TODO");
	}

	static async deleteAgent(request: FastifyRequest, reply: FastifyReply) {
		reply.send("TODO");
	}

	static async getTools(request: FastifyRequest, reply: FastifyReply) {
		reply.send(tools.map((tool) => tool.name));
	}
}
