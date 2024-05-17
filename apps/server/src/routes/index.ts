import type { FastifyInstance } from "fastify";

import { getUser } from "@/hooks/getUser";

import { setupAgentsRoute } from "./agents";
import { setupMessageFilesRoute } from "./messageFiles";
import { setupModelsRoute } from "./models";
import { setupAgentRunsRoute } from "./runs";
import { setupServerRoute } from "./server";
import { setupThreadsRoute } from "./threads";
import { setupUserRoute } from "./user";
import { setupMessagesRoute } from "./messages";

export async function setupRoutes(app: FastifyInstance) {
	await app.register(setupServerRoute);
	await app.register(setupUserRoute);
	await app.register(setupModelsRoute);

	// authenticated routes
	await app.register(async (app) => {
		app.addHook("preHandler", getUser);

		await app.register(setupAgentsRoute, { prefix: "/agents" });
		await app.register(setupThreadsRoute, { prefix: "/threads" });
		await app.register(setupAgentRunsRoute, { prefix: "/threads" });
		await app.register(setupMessagesRoute, {
			prefix: "/threads/:threadId/messages",
		});
		await app.register(setupMessageFilesRoute, {
			prefix: "/threads/:threadId/messages/:messageId/files",
		});
	});
}
