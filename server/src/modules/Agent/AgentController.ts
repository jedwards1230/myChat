import type { FastifyReply, FastifyRequest } from "fastify";

import { AgentRepo } from "./AgentRepo";
import type { AgentCreateSchema } from "./AgentSchema";

export default class AgentController {
	static async createAgent(request: FastifyRequest, reply: FastifyReply) {
		const user = request.user;
		const agent = request.body as AgentCreateSchema;
		const savedAgent = await AgentRepo.save({ ...agent, owner: user });
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
}
