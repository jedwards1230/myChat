import type { FastifyReply, FastifyRequest } from "fastify";

import { getUserRepo } from "@/modules/User/UserRepo";
import logger from "@/lib/logs/logger";

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
	const token = request.headers.authorization;
	if (!token) {
		return reply.code(401).send({ error: "Unauthorized" });
	}

	const user = await getUserRepo().getUserById(token);
	if (!user) {
		return reply.code(401).send({ error: "User not found" });
	}

	request.user = user;
};

export const authenticateWs = async (token: string | undefined) => {
	const user = await getUserRepo().getUserById(token);
	if (!user) {
		logger.warn("User not found", {
			token,
			functionName: "authenticateWs",
		});
		throw new Error("User not found");
	}

	return user;
};
