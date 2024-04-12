import type { FastifyInstance } from "fastify";

import { ModelListSchema } from "@/modules/Models/ModelsSchema";
import { modelList } from "@/modules/Models/data";

export async function setupModelsRoute(app: FastifyInstance) {
	app.get("/models", {
		schema: { response: { 200: ModelListSchema } },
		oas: { description: "Get a list of available Models", tags: ["Models"] },
		handler: async (request, reply) => {
			reply.send(modelList);
		},
	});
}
