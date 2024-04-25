import type { FastifyInstance } from "fastify";

import { ModelListSchema } from "@mychat/shared/schemas/Models";
import { modelList } from "@/modules/Models/data";

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
