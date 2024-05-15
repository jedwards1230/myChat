import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";
import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";

import { chatResponseEmitter } from "@/lib/events";
import { pgRepo } from "@/lib/pg";

import { StreamResponseController } from "./StreamResponseController";
import { MessageController } from "./MessageController";

import type { AgentRun, AgentRunStatus } from "@mychat/db/entity/AgentRun";
import type { Message } from "@mychat/db/entity/Message";
import type { Thread } from "@mychat/db/entity/Thread";
import type { Role } from "@mychat/shared/schemas/Message";
import { logger } from "@/lib/logger";
import {
	NexusServiceRegistry,
	type LLMNexus,
	type ChatOptions,
} from "@mychat/agents/LLMInterface";

export class LLMNexusController {
	/**
	 * Process the Agent Run.
	 * This is called by the Queue in `AgentRunSubscriber`
	 * */
	static processResponse = async (agentRun: AgentRun) => {
		const update = (status: AgentRunStatus) =>
			pgRepo["AgentRun"].update({ id: agentRun.id }, { status });

		await update("in_progress");
		const llmServce = NexusServiceRegistry.getService(agentRun.model.serviceName);
		const opts: ChatOptions = {
			tools: agentRun.agent.getTools(),
			model: agentRun.model.name,
			stream: agentRun.stream,
		};

		switch (agentRun.type) {
			case "getChat": {
				const response = await this.generateChatResponse({
					agentRun,
					llmServce,
					opts,
				});

				await this.saveResponse(agentRun, response);
				break;
			}
			case "getTitle": {
				const res = await this.generateTitle({
					llmServce,
					agentRun,
					opts: {
						...opts,
						stream: false,
					},
				});

				await this.saveTitle(agentRun.thread, res);
				break;
			}
		}

		await update("completed");
	};

	static async getMessages(activeMessage: Message) {
		const messagesWithoutFiles = (
			await pgRepo["Message"].findAncestors(activeMessage, {
				relations: ["tool_calls", "tool_call_id", "files"],
			})
		).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
		const messages = await MessageController.injectFilesContent(messagesWithoutFiles);
		return messages;
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
			const messages = await this.getMessages(thread.activeMessage);
			const systemMessage = messages.find((m) => m.role === "system");
			if (!systemMessage) throw new Error("No system message found");

			const activeMessageContent =
				thread.activeMessage.content ||
				thread.activeMessage.files?.map((f) => f.name).join(", ");
			if (!activeMessageContent) throw new Error("No active message content found");

			// inject rag metadata and decoded params into the system message
			const ragRes = await pgRepo["Document"].searchDocuments(activeMessageContent);
			logger.debug("Searched documents", {
				ragRes: ragRes.map((d) => d.metadata),
				functionName: "AgentRunQueue.processQueue",
			});

			if (ragRes.length)
				systemMessage.content +=
					`\n\nThe following are your memories, influenced by recent conversation:\n\n` +
					JSON.stringify(ragRes.map((d) => d.metadata));

			const completion = await llmServce.createChatCompletion(
				messages.map((m) => m.toJSON()),
				opts
			);
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
		agentRun: AgentRun,
		response: ChatCompletionStream | ChatCompletion
	) {
		try {
			if (response instanceof ChatCompletionStream) {
				await this.saveStreamResponse(agentRun, response);
			} else {
				await this.saveJSONResponse(agentRun, response);
			}
		} catch (error) {
			logger.error("Error saving response", {
				error,
				response,
				functionName: "LLMNexusController.saveResponse",
			});
			throw error;
		}
	}

	private static async saveStreamResponse(
		agentRun: AgentRun,
		response: ChatCompletionStream
	) {
		try {
			chatResponseEmitter.emit("responseStreamReady", {
				agentRunId: agentRun.id,
				response,
			});

			chatResponseEmitter.on("abort", async ({ agentRunId }) => {
				if (agentRunId !== agentRun.id) return;
				logger.debug("Aborting chat CHECK", {
					agentRunId,
					response,
				});
				// TODO: It's not clear that this is actually aborting the stream from openai
				response.controller.abort();
				response.abort();

				await pgRepo["AgentRun"].update(
					{ id: agentRun.id },
					{ status: "cancelled" }
				);
			});

			await StreamResponseController.processResponse(agentRun.thread, response);
		} catch (error) {
			logger.error("Error saving stream response", {
				error,
				response,
				functionName: "LLMNexusController.saveStreamResponse",
			});
		}
	}

	private static async saveJSONResponse(agentRun: AgentRun, response: ChatCompletion) {
		const { thread } = agentRun;
		if (!thread.activeMessage) throw new Error("No active message in thread");
		try {
			chatResponseEmitter.emit("responseJSONReady", {
				agentRunId: agentRun.id,
				response,
			});
			const responseMsg = response.choices[0]?.message;
			if (!responseMsg) throw new Error("No response message");
			await pgRepo["Thread"].addMessage(thread, {
				role: responseMsg.role as Role,
				content: responseMsg.content,
				parent: thread.activeMessage,
			});
		} catch (error) {
			logger.error("Error saving JSON response", {
				error,
				response,
				functionName: "LLMNexusController.saveJSONResponse",
			});
		}
	}

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
			const messages = await LLMNexusController.getMessages(thread.activeMessage);

			const SYSTEM_MESSAGE = `Generate a thread title for the provided conversation history. 
			Only respond with the title. 
			Do not include any other information. 
			Do not include unnecessary punctuation. 
			Do not wrap the title in quotes.
			Ensure the title is as general to the conversation as possible.\n\n
			${JSON.stringify(messages.map((m) => ({ role: m.role, content: m.content })))}`;

			const msgHistory = [{ role: "system", content: SYSTEM_MESSAGE }] as any[];
			const response = await llmServce.createTitleCompletionJSON(msgHistory, opts);

			return response;
		} catch (error) {
			logger.error("Error generating title", {
				error,
				functionName: "LLMNexusController.generateTitle",
			});
			throw error;
		}
	}

	private static async saveTitle(thread: Thread, response: ChatCompletionRunner) {
		await response.done();
		const toolCall = await response.finalFunctionCall();
		if (!toolCall?.arguments) throw new Error("No title generated");

		const { title } = JSON.parse(toolCall.arguments);
		if (!title) throw new Error("No title generated");

		thread.title = title;
		await pgRepo["Thread"].update(thread.id, { title });
	}
}
