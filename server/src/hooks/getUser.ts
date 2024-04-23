import type { FastifyReply, FastifyRequest } from "fastify";

import { User } from "@/modules/User/UserModel";
import logger from "@/lib/logs/logger";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization;
        if (!token) return reply.code(401).send({ error: "Unauthorized" });

        const user = await request.server.orm.getRepository(User).findOne({
            where: { apiKey: token },
            relations: ["threads", "agents", "tools"],
        });
        if (!user) return reply.code(401).send({ error: "User not found" });

        request.user = user;
    } catch (error) {
        logger.error("Error getting user", error);
        return reply.code(401).send({ error: "Unauthorized" });
    }
}
