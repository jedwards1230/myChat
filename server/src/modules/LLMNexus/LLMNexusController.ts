import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";

import type { Connection } from "@/lib/ws";
import { wsHandler } from "@/index";
import logger from "@/lib/logs/logger";

import { getMessageRepo } from "../Message/MessageRepo";
import type { Role } from "../Message/RoleModel";

import { StreamResponseController } from "../Thread/StreamResponseController";
import type { Thread } from "../Thread/ThreadModel";
import { getThreadRepo } from "../Thread/ThreadRepo";

import type { AgentRun } from "../AgentRun/AgentRunModel";
import { NexusServiceRegistry, type LLMNexus, type ChatOptions } from "./LLMInterface";
import { Browser } from "./Tools/browser/browser";

export class LLMNexusController {
	/**
	 * Process the Agent Run.
	 * This is called by the Queue in `AgentRunSubscriber`
	 * */
	static processResponse = async (agentRun: AgentRun) => {
		const llmServce = NexusServiceRegistry.getService("OpenAIService");

		const tools = agentRun.agent.tools
			.map((tool) => {
				switch (tool) {
					case "browser":
						return Browser.getTools();
					default:
						return [];
				}
			})
			.flat();

		try {
			switch (agentRun.type) {
				case "getChat": {
					const response = await this.generateChatResponse({
						agentRun,
						llmServce,
						opts: {
							tools,
							model: "gpt-4-0125-preview",
							stream: agentRun.stream,
						},
					});

					const { thread, session, stream } = agentRun;
					let conn: Connection | undefined;
					if (stream && session) {
						conn = wsHandler.get(session.id);
					}

					await this.saveResponse(thread, response, conn);
					break;
				}
				case "getTitle": {
					await this.generateTitle({
						llmServce,
						agentRun,
						opts: {
							tools,
							model: "gpt-4-0125-preview",
							stream: agentRun.stream,
						},
					});
					break;
				}
			}
		} catch (error) {
			logger.error("Error processing response", {
				error,
				functionName: "LLMNexusController.processResponse",
			});
		}
	};

	private static async generateTitle({
		agentRun: { thread },
		llmServce,
		opts,
	}: {
		agentRun: AgentRun;
		llmServce: LLMNexus;
		opts: ChatOptions;
	}) {
		if (!thread.activeMessage) throw new Error("No active message in thread");
		const messages = await getMessageRepo().getMessageHistoryList(
			thread.activeMessage,
			true
		);
		const title = await llmServce.createTitleFromChatHistory(messages, opts);
		thread.title = title;
		await getThreadRepo().update(thread.id, { title });
		return title;
	}

	private static async generateChatResponse({
		agentRun: { thread, stream },
		opts,
		llmServce,
	}: {
		agentRun: AgentRun;
		opts: ChatOptions;
		llmServce: LLMNexus;
	}) {
		if (!thread.activeMessage) throw new Error("No active message found");
		const messages = await getMessageRepo().getMessageHistoryList(
			thread.activeMessage,
			true
		);
		return llmServce.createChatCompletion(messages, opts);
	}

	private static async saveResponse(
		thread: Thread,
		response: ChatCompletionStream | ChatCompletion,
		conn?: Connection
	) {
		if (response instanceof ChatCompletionStream) {
			if (!conn) throw new Error("No WebSocket connection");
			// Handle streamed response
			StreamResponseController.processResponse(thread, response, conn);
		} else {
			if (!thread.activeMessage) throw new Error("No active message in thread");
			const responseMsg = response.choices[0].message;

			logger.debug("Adding Message", {
				functionName: "LLMNexusController.saveResponse",
			});
			getThreadRepo().addMessage(thread, {
				role: responseMsg.role as Role,
				content: Array.isArray(responseMsg.content)
					? responseMsg.content.join(" ")
					: responseMsg.content?.toString(),
				parent: thread.activeMessage,
			});
		}
	}
}
