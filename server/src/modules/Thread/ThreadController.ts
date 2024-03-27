import { ChatCompletionStream } from "openai/resources/beta/chat/completions";
import type { ChatCompletion } from "openai/resources/index";

import type { Connection } from "@/lib/ws";
import logger from "@/lib/logs/logger";
import { wsHandler } from "@/index";
import { StreamResponseController } from "./StreamResponseController";

import { MessageRepo } from "@/modules/Message/MessageRepo";
import type { Message } from "@/modules/Message/MessageModel";
import type { Role } from "@/modules/Message/RoleModel";

import { ThreadRepo } from "@/modules/Thread/ThreadRepo";
import { Thread } from "@/modules/Thread/ThreadModel";

import type { User } from "@/modules/User/UserModel";
import type { SocketSession } from "@/modules/User/SessionModel";

import { NexusDispatcher } from "@/modules/Models/LLMInterface";

export class ThreadController {
	static async generateTitle(thread: Thread) {
		if (!thread.activeMessage) throw new Error("No active message in thread");
		const messages = await MessageRepo.getMessageHistoryList(
			thread.activeMessage,
			true
		);
		const title = await NexusDispatcher.createTitleFromChatHistory(messages);
		thread.title = title;
		await ThreadRepo.update(thread.id, { title });
		return title;
	}

	static async saveResponse(
		thread: Thread,
		response: ChatCompletionStream | ChatCompletion,
		conn?: Connection
	) {
		if (response instanceof ChatCompletionStream) {
			if (!conn) throw new Error("No WebSocket connection");
			StreamResponseController.processResponse(thread, response, conn);
		} else {
			if (!thread.activeMessage) throw new Error("No active message in thread");
			const responseMsg = response.choices[0].message;

			logger.debug("Adding Message", {
				functionName: "ThreadController.saveResponse",
			});
			ThreadRepo.addMessage(thread, {
				role: responseMsg.role as Role,
				content: Array.isArray(responseMsg.content)
					? responseMsg.content.join(" ")
					: responseMsg.content?.toString(),
				parent: thread.activeMessage,
			});
		}
	}

	static processResponse = async (
		{
			threadId,
			user,
			session,
		}: {
			threadId?: string | null;
			user: User;
			session?: SocketSession;
		},
		stream: boolean
	) => {
		try {
			const thread = await ThreadRepo.getOrCreateThread(user, threadId);
			if (!thread) {
				return {
					success: false,
					error: {
						message: "Thread not found",
						code: 404,
					},
				};
			}

			if (!thread.activeMessage) {
				return {
					success: false,
					error: {
						message: "No active message found",
						code: 404,
					},
				};
			}

			const response = await ThreadController.generateChatResponse(
				thread.activeMessage,
				stream
			);
			let conn: Connection | undefined;
			if (stream && session) {
				conn = wsHandler.get(session.id);
			}
			await ThreadController.saveResponse(thread, response, conn);

			return { success: true, thread, response };
		} catch (error) {
			logger.error("Error processing response", { error });
			return {
				success: false,
				error: {
					message: `Error processing response ${
						JSON.stringify(error) || error
					}`,
					code: 500,
				},
			};
		}
	};

	private static async generateChatResponse(activeMessage: Message, stream = false) {
		const messages = await MessageRepo.getMessageHistoryList(activeMessage, true);
		return NexusDispatcher.createChatCompletion(messages, stream);
	}
}
