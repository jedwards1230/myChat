import { ChatCompletionStream } from "openai/resources/beta/chat/completions";
import type { ChatCompletion } from "openai/resources/index";

import type { Connection } from "@/lib/ws";
import logger from "@/lib/logs/logger";
import { wsHandler } from "@/index";

import { StreamResponseController } from "../Thread/StreamResponseController";
import type { Thread } from "../Thread/ThreadModel";
import { ThreadRepo } from "../Thread/ThreadRepo";

import type { Message } from "../Message/MessageModel";
import type { Role } from "../Message/RoleModel";
import { MessageRepo } from "../Message/MessageRepo";

import type { SocketSession } from "@/modules/User/SessionModel";
import { NexusDispatcher } from "@/modules/Models/LLMInterface";
import { AgentRunRepo } from "./AgentRunRepo";

export class AgentRunController {
	static processResponse = async ({
		thread,
		session,
		stream = true,
	}: {
		thread: Thread;
		session?: SocketSession;
		stream?: boolean;
	}) => {
		try {
			if (!thread.activeMessage) throw new Error("No active message found");
			const run = await AgentRunRepo.insert({
				thread,
				agent: thread.agent,
			});

			const response = await AgentRunController.generateChatResponse(
				thread.activeMessage,
				stream
			);

			let conn: Connection | undefined;
			if (stream && session) {
				conn = wsHandler.get(session.id);
			}

			await AgentRunController.saveResponse(thread, response, conn);
		} catch (error) {
			logger.error("Error processing response", {
				error,
				functionName: "AgentRunController.processResponse",
			});
		}
	};

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

	private static async saveResponse(
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
				functionName: "AgentRunController.saveResponse",
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

	private static async generateChatResponse(activeMessage: Message, stream = false) {
		const messages = await MessageRepo.getMessageHistoryList(activeMessage, true);
		return NexusDispatcher.createChatCompletion(messages, stream);
	}
}
