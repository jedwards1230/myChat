import type { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
	try {
		const token = request.headers.authorization;
		if (!token) return reply.code(401).send({ error: "Unauthorized" });

		const user = await pgRepo.User.findOne({
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
