import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";
import { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";

import logger from "@/lib/logs/logger";
import { chatResponseEmitter } from "@/lib/events";
import MessageQueue from "@/lib/queue";

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

					const { thread } = agentRun;

					await this.saveResponse(thread, response);
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
		try {
			const messages = await getMessageRepo().getMessageHistoryList(
				thread.activeMessage,
				true
			);
			const title = await llmServce.createTitleFromChatHistory(messages, opts);
			thread.title = title;
			await getThreadRepo().update(thread.id, { title });
			return title;
		} catch (error) {
			logger.error("Error generating title", {
				error,
				functionName: "LLMNexusController.generateTitle",
			});
		}
	}

	private static async generateChatResponse({
		agentRun: { thread },
		opts,
		llmServce,
	}: {
		agentRun: AgentRun;
		opts: ChatOptions;
		llmServce: LLMNexus;
	}) {
		if (!thread.activeMessage) throw new Error("No active message found");
		try {
			const messages = await getMessageRepo().getMessageHistoryList(
				thread.activeMessage,
				true
			);
			const completion = await llmServce.createChatCompletion(messages, opts);
			return completion;
		} catch (error) {
			logger.error("Error generating chat response", {
				error,
				functionName: "LLMNexusController.generateChatResponse",
			});
			throw error;
		}
	}

	private static async saveResponse(
		thread: Thread,
		response: ChatCompletionStreamingRunner | ChatCompletionStream | ChatCompletion
	) {
		try {
			if (
				response instanceof ChatCompletionStream ||
				response instanceof ChatCompletionStreamingRunner
			) {
				// Handle streamed response
				chatResponseEmitter.sendResponseStreamReady({
					threadId: thread.id,
					response,
				});
				StreamResponseController.processResponse(
					thread,
					response,
					new MessageQueue()
				);
			} else {
				if (!thread.activeMessage) throw new Error("No active message in thread");
				chatResponseEmitter.sendResponseJSONReady({
					threadId: thread.id,
					response,
				});
				const responseMsg = response.choices[0].message;
				getThreadRepo().addMessage(thread, {
					role: responseMsg.role as Role,
					content: responseMsg.content,
					parent: thread.activeMessage,
				});
			}
		} catch (error) {
			logger.error("Error saving response", {
				error,
				response,
				functionName: "LLMNexusController.saveResponse",
			});
		}
	}
}
