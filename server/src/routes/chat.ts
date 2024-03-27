import type { FastifyInstance } from "fastify";

import { ThreadController } from "@/modules/Thread/ThreadController";
import logger from "@/lib/logs/logger";
import { Type, type Static } from "@sinclair/typebox";

const PostChatBody = Type.Object({
	threadId: Type.Optional(Type.String()),
	stream: Type.Optional(Type.Boolean()),
});

type PostChatBody = Static<typeof PostChatBody>;

export const setupChatRoute = (app: FastifyInstance) => {
	app.post("/chat", {
		schema: {
			body: PostChatBody,
		},
		handler: async (request, reply) => {
			try {
				const { threadId, stream } = request.body as PostChatBody;

				const result = await ThreadController.processResponse(
					{
						threadId,
						user: request.user,
					},
					false
				);
				if (result.success && result.thread && result.response) {
					reply.header("X-Thread-Id", result.thread.id);
					if (!stream) reply.send(result.response);
				} else {
					if (!result.error)
						throw new Error(
							"An error occurred while processing your request."
						);
					logger.error(result.error.message);
					reply.status(result.error.code).send({
						error: result.error.message,
					});
				}
			} catch (error) {
				logger.error(error);
				reply.status(500).send({
					error: "An error occurred while processing your request.",
				});
			}
		},
	});
};
