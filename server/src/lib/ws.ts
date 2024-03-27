import type WebSocket from "ws";

import { UserRepo } from "@/modules/User/UserRepo";
import { ThreadController } from "@/modules/Thread/ThreadController";
import type { SocketSession } from "@/modules/User/SessionModel";
import type { SocketClientMessage } from "@/types/wsResponse";
import { authenticateWs } from "@/middleware/auth";

import logger from "./logs/logger";
import MessageQueue from "./queue";

export interface Connection {
	ws: WebSocket;
	session: SocketSession;
	messageQueue: MessageQueue;
}

export class WebSocketHandler {
	wsConnections = new Map<string, Connection>();

	addListener(wss: WebSocket.Server) {
		/* 
		Connect to the WebSocket server and listen for new connections.
		When a new connection is established, add it to the wsConnections map.
		Listens for user id in the url
		ex. ws://localhost:3000/{userId}
		*/
		wss.on("connection", async (ws, req) => {
			try {
				const userId = req.url?.split("/")[2];
				const user = await authenticateWs(userId);
				const socketSession = await UserRepo.createSocketSession(user);
				if (!socketSession) {
					ws.close();
					return;
				}

				this.addConnection(socketSession, ws);
				ws.on("close", () => this.handleClose(socketSession));
				ws.on("error", (error) => this.handleError(socketSession, error));
				ws.on("message", (res) =>
					this.handleMessage(socketSession, JSON.parse(res.toString()))
				);
			} catch (error) {
				logger.error("Error in WebSocket connection", error);
				ws.close();
			}
		});
	}

	addConnection(session: SocketSession, ws: WebSocket) {
		if (this.wsConnections.has(session.id)) {
			logger.error("Session already exists", {
				session,
				functionName: "WebSocketHandler.addConnection",
			});
			return;
		}
		logger.verbose(`New connection ${session.id}`);
		this.wsConnections.set(session.id, {
			ws,
			session,
			messageQueue: new MessageQueue(),
		});
	}

	get(sessionId: string) {
		const ws = this.wsConnections.get(sessionId);
		if (!ws) throw new Error("No WebSocket connection found");
		return ws;
	}

	async handleMessage(session: SocketSession, message: SocketClientMessage) {
		switch (message.type) {
			case "getChat":
				const result = await ThreadController.processResponse(
					{
						threadId: message.data.threadId,
						user: session.user,
						session,
					},
					true
				);
				if (result.error) logger.error(result.error.message);
				break;

			case "error":
				logger.error("Received error message", { error: message.data });
				break;

			case "test":
				logger.debug("Received test message", { type: message.type });
				break;
			default:
				logger.error("Unknown message type", { error: message });
		}
	}

	handleClose(session: SocketSession) {
		logger.info(`Connection closed: ${session.id}`);
		this.wsConnections.delete(session.id);
	}

	handleError(session: SocketSession, error: Error) {
		logger.error(`Error in connection: ${session.id}`, { error });
	}
}
