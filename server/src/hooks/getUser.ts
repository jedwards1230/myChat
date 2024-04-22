import type { FastifyReply, FastifyRequest } from "fastify";

import { User } from "@/modules/User/UserModel";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization;
    if (!token) return reply.code(401).send({ error: "Unauthorized" });

    const user = await request.server.orm.getRepository(User).findOne({
        where: { apiKey: token },
        relations: ["threads", "agents"],
    });
    if (!user) return reply.code(401).send({ error: "User not found" });

    request.user = user;
}
