import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import logger from "@/lib/logs/logger";
import type { Agent } from "@/modules/Agent/AgentModel";
import { AgentRepo } from "@/modules/Agent/AgentRepo";

export function getAgent(relations?: FindOneOptions<Agent>["relations"]) {
	return async function getAgent(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { agentId } = request.params as { agentId: string };

			const agent = await AgentRepo.getAgentById(request.user, agentId, relations);
			if (!agent) {
				return reply.status(500).send({
					error: "(AgentRepo.getAgentById) An error occurred while processing your request.",
				});
			}

			request.agent = agent;
		} catch (error) {
			// error for missing item in db
			logger.error("Error in getAgent", {
				error,
				functionName: "getAgent",
			});
			reply.status(500).send({
				error: "An error occurred while processing your request.",
			});
		}
	};
}
