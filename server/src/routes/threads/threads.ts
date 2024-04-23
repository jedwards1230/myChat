import type { FastifyInstance } from "fastify";

import { getThread } from "@/hooks/getThread";
import { ThreadSchema, ThreadListSchema } from "@/modules/Thread/ThreadSchema";
import { ThreadController } from "@/modules/Thread/ThreadController";

export async function setupThreadsRoute(app: FastifyInstance) {
    // GET Thread History for user
    app.get("/", {
        schema: {
            description: "List Threads for User.",
            tags: ["Thread"],
            response: { 200: ThreadListSchema },
        },
        handler: async (request, reply) => reply.send(request.user.threads),
    });

    // POST Create a new thread
    app.post("/", {
        schema: {
            description: "Create new Thread.",
            tags: ["Thread"],
            response: { 200: ThreadSchema },
        },
        handler: ThreadController.createThread,
    });

    await app.register(async (app) => {
        app.addHook("preHandler", getThread());

        // GET Thread by ID
        app.get("/:threadId", {
            schema: {
                description: "Get Thread by ID.",
                tags: ["Thread"],
                response: { 200: ThreadSchema },
            },
            handler: async (req, res) => res.send(req.thread),
        });

        // POST Update a thread by ID
        app.post("/:threadId", {
            schema: {
                description: "Update Thread by ID.",
                tags: ["Thread"],
                response: { 200: ThreadSchema },
            },
            handler: ThreadController.updateThread,
        });

        // DELETE Thread by ID
        app.delete("/:threadId", {
            schema: { description: "Delete Thread by ID.", tags: ["Thread"] },
            handler: ThreadController.deleteThread,
        });
    });
}
