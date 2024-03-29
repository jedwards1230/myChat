import type { FastifyInstance } from "fastify";
import { Type, type Static } from "@fastify/type-provider-typebox";

import { AgentRunController } from "@/modules/AgentRun";
import { getThread } from "@/middleware/getThread";

const PostChatBody = Type.Object({ stream: Type.Optional(Type.Boolean()) });
type PostChatBody = Static<typeof PostChatBody>;

export const setupChatRoute = (app: FastifyInstance) => {
	app.post("/", {
		schema: { body: PostChatBody },
		preHandler: getThread({
			activeMessage: true,
			messages: { files: { fileData: true } },
		}),
		handler: async (request, reply) => {
			const thread = request.thread;
			const { stream } = request.body as PostChatBody;

			await AgentRunController.processResponse({
				thread,
				stream,
			});
		},
	});
};
