import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { resetDatabase, initDb } from "@/lib/pg";

export async function setupServerRoute(app: FastifyInstance) {
    app.get("/ping", {
        schema: {
            description: "Ping the server",
            tags: ["Server"],
            response: { 200: z.literal("pong") },
        },
        handler: async (_, reply) => reply.send("pong"),
    });

    app.get(
        "/reset",
        { schema: { description: "Reset the database", tags: ["Admin"] } },
        async (_, res) => {
            await resetDatabase();
            await initDb();
            res.send({ ok: true });
        }
    );
}
