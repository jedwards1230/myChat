import type { FastifyInstance } from "fastify";

import { authenticate } from "@/middleware/auth";
import { UserSchema } from "@/modules/User/UserSchema";

export async function setupUserRoute(app: FastifyInstance) {
	app.get("/user", {
		schema: { response: { 200: UserSchema } },
		oas: { description: "Get the current user", tags: ["User"] },
		handler: async (request, reply) => {
			await authenticate(request, reply);
			reply.send(request.user);
		},
	});
}
