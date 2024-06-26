import type { FastifyReply, FastifyRequest } from "fastify";

import type { AgentTool } from "@mychat/db/entity/AgentTool";
import { Tools } from "@mychat/agents/tools/index";
import type {
	AgentToolCreateSchema,
	AgentToolUpdateSchema,
} from "@mychat/shared/schemas/AgentTool";
import { pgRepo } from "@/lib/pg";

export class AgentToolController {
	static async createAgentTool(request: FastifyRequest, reply: FastifyReply) {
		const { agent } = request;
		const agentTool = request.body as AgentToolCreateSchema;
		const savedAgent = await pgRepo["AgentTool"].save({
			...agentTool,
			agent,
		});
		reply.send(savedAgent);
	}

	static async getAgentTools(request: FastifyRequest, reply: FastifyReply) {
		reply.send(
			request.user.agents.reduce(
				(acc, agent) => [...acc, ...agent.tools],
				[] as AgentTool[]
			)
		);
	}

	static async getAgentTool(request: FastifyRequest, reply: FastifyReply) {
		const { agentToolId } = request.params as { agentToolId: string };
		const agentTool = await pgRepo["AgentTool"].findOne({
			where: { id: agentToolId },
		});
		reply.send(agentTool);
	}

	static async updateAgentTool(request: FastifyRequest, reply: FastifyReply) {
		const agentUpdate = request.body as AgentToolUpdateSchema;
		const agentTool = request.agentTool;

		switch (agentUpdate.type) {
			case "enabled": {
				agentTool[agentUpdate.type] = agentUpdate.value;
				break;
			}
			case "parameters": {
				agentTool[agentUpdate.type] = agentUpdate.value;
				break;
			}
			case "toolName": {
				agentTool[agentUpdate.type] = agentUpdate.value;
				break;
			}
			case "name":
			case "description": {
				agentTool[agentUpdate.type] = agentUpdate.value;
				break;
			}
		}
		const updatedAgentTool = await agentTool.save();
		reply.send(updatedAgentTool);
	}

	static async deleteAgentTool(request: FastifyRequest, reply: FastifyReply) {
		reply.send("TODO");
	}

	/** Return list of all tools available on the server */
	static async getTools(request: FastifyRequest, reply: FastifyReply) {
		reply.send(Tools.map((tool) => tool.name));
	}
}
