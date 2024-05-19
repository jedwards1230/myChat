import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";
import { chatResponseEmitter } from "@/lib/events";
import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";

import type { ChatOptions, LLMNexus } from "@mychat/agents/LLMInterface";
import type {
	AgentRun,
	AgentRunStatus,
	Message,
	MessageRole,
	Thread,
} from "@mychat/db/schema";
import { NexusServiceRegistry } from "@mychat/agents/LLMInterface";

import { StreamResponseController } from "./StreamResponseController";

export class LLMNexusController {
	/**
	 * Process the Agent Run.
	 * This is called by the Queue in `AgentRunSubscriber`
	 * */
	static processResponse = async (agentRun: AgentRun) => {
		const update = (status: AgentRunStatus) =>
			pgRepo.AgentRun.update({ id: agentRun.id }, { status });

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
			await pgRepo.Message.findAncestors(activeMessage, {
				relations: ["tool_calls", "tool_call_id", "files"],
			})
		).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
		const messages = await pgRepo.Message.injectFilesContent(messagesWithoutFiles);
		return messages;
	}

	private static async generateChatResponse({
		agentRun,
		opts,
		llmServce,
	}: {
		agentRun: AgentRun;
		opts: ChatOptions;
		llmServce: LLMNexus;
	}) {
		try {
			const messages = await pgRepo.AgentRun.generateRagContent(agentRun.id);

			const completion = await llmServce.createChatCompletion(
				messages.map((m) => m.toJSON()),
				opts,
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
		response: ChatCompletionStream | ChatCompletion,
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
		response: ChatCompletionStream,
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

				await pgRepo.AgentRun.update(
					{ id: agentRun.id },
					{ status: "cancelled" },
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
			await pgRepo.Thread.addMessage(thread, {
				role: responseMsg.role as MessageRole,
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
			const messages = await pgRepo.Message.getMessages(thread.activeMessage);

			const SYSTEM_MESSAGE = `Generate a thread title for the provided conversation history. 
			Only respond with the title. 
			Do not include any other information. 
			Do not include unnecessary punctuation. 
			Do not wrap the title in quotes.
			Ensure the title is as general to the conversation as possible.\n\n
			${JSON.stringify(messages.map((m) => ({ role: m.role, content: m.content })))}`;

			const msgHistory = [{ role: "system", content: SYSTEM_MESSAGE }] as any[];
			const response = llmServce.createTitleCompletionJSON(msgHistory, opts);

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
		await pgRepo.Thread.update(thread.id, { title });
	}
}
