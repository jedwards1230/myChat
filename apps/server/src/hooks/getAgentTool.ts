import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import { logger } from "@/lib/logger";
import type { AgentTool } from "@mychat/db/entity/AgentTool";
import { pgRepo } from "@/lib/pg";

export function getAgentTool(relations?: FindOneOptions<AgentTool>["relations"]) {
	return async function getAgent(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { agentToolId } = request.params as { agentToolId: string };
			const agentTool = await pgRepo["AgentTool"].findOne({
				where: { id: agentToolId },
				relations,
			});
			if (!agentTool) {
				return reply.status(404).send({
					error: "(AgentRepo.getAgentById) Agent not found.",
				});
			}

			request.agentTool = agentTool;
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
