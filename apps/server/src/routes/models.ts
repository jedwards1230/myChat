import type { FastifyInstance } from "fastify";

import { ModelListSchema } from "@mychat/shared/schemas/models";
import { modelList } from "@mychat/agents/models/chat";

export async function setupModelsRoute(app: FastifyInstance) {
	app.get("/models", {
		schema: {
			description: "Get a list of available Models",
			tags: ["Models"],
			response: { 200: ModelListSchema },
		},
		handler: async (request, reply) => {
			reply.send(modelList);
		},
	});
}
