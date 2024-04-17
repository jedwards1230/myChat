import type { FastifyReply, FastifyRequest } from "fastify";

import { getUserRepo } from "@/modules/User/UserRepo";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers.authorization;
	if (!token) {
		return reply.code(401).send({ error: "Unauthorized" });
	}

	const user = await getUserRepo().findOne({
		where: { apiKey: token },
		relations: ["threads", "agents"],
	});
	if (!user) {
		return reply.code(401).send({ error: "User not found" });
	}

	request.user = user;
}
