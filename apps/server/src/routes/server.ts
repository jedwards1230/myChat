import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { resetDatabase } from "@mychat/db/index";
import { getUser } from "@/hooks/getUser";

export async function setupServerRoute(app: FastifyInstance) {
	app.get("/ping", {
		schema: {
			description: "Ping the server",
			tags: ["Server"],
			response: { 200: z.literal("pong") },
		},
		handler: async (_, reply) => reply.send("pong"),
	});

	await app.register(async (app) => {
		app.addHook("preHandler", getUser);

		app.get(
			"/reset",
			{ schema: { description: "Reset the database", tags: ["Admin"] } },
			async (_, res) => {
				await resetDatabase();
				return res.send({ ok: true });
			}
		);
	});
}
