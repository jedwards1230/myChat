import type { FastifyInstance } from "fastify";

import { authenticate } from "@/middleware/auth";
import { UserSchema } from "@/modules/User/UserSchema";

export const setupUserRoute = (fastify: FastifyInstance) => {
	fastify.get("/user", {
		schema: { response: { 200: UserSchema } },
		preHandler: [authenticate],
		handler: async (request, reply) => {
			reply.send(request.user);
		},
	});
};
