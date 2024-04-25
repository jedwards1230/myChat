import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import logger from "@/lib/logs/logger";
import { Agent } from "@/modules/Agent/AgentModel";

export function getAgent(relations?: FindOneOptions<Agent>["relations"]) {
	return async function getAgent(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user } = request;
			const { agentId } = request.params as { agentId: string };
			const agent = await request.server.orm.getRepository(Agent).findOne({
				where: { id: agentId, owner: { id: user.id } },
				relations,
			});
			if (!agent) {
				return reply.status(404).send({
					error: "(AgentRepo.getAgentById) Agent not found.",
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
