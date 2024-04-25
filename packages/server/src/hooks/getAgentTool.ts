import type { FindOneOptions } from "typeorm";
import type { FastifyRequest, FastifyReply } from "fastify";

import logger from "@/lib/logs/logger";
import { AgentTool } from "@/modules/AgentTool/AgentToolModel";

export function getAgentTool(relations?: FindOneOptions<AgentTool>["relations"]) {
    return async function getAgent(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { agent } = request;
            const { agentToolId } = request.params as { agentToolId: string };
            const agentTool = await request.server.orm.getRepository(AgentTool).findOne({
                where: { id: agentToolId, agent: { id: agent.id } },
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
