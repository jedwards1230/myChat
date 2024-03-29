import type { FastifyInstance } from "fastify";

import { authenticate } from "@/middleware/auth";
import { UserSchema } from "@/modules/User/UserSchema";

export const setupUserRoute = (app: FastifyInstance) => {
	app.get("/user", {
		schema: { response: { 200: UserSchema } },
		oas: { description: "Get the current user", tags: ["User"] },
		preHandler: [authenticate],
		handler: async (request, reply) => {
			reply.send(request.user);
		},
	});
};
