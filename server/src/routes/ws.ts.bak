import type { FastifyInstance } from "fastify";

import logger from "@/lib/logs/logger";

export const setupWsRoute = (app: FastifyInstance) => {
	app.get(
		"/ws",
		{
			websocket: true,
			//schema: { response: { 200: UserSchema } },
			oas: {
				description: "WebSocket endpoint",
				tags: ["WebSocket"],
			},
		},
		(socket, req) => {
			logger.debug("WebSocket connection established", {
				socket,
			});
			socket.on("open", () => {
				logger.debug("WebSocket connection opened", {
					socket,
				});
				socket.send("hi from server");
			});
			socket.on("message", (message) => {
				logger.debug("WebSocket message received", {
					msg: message,
					socket,
				});
				// message.toString() === 'hi from client'
				socket.send("hi from server");
			});
		}
	);
};
