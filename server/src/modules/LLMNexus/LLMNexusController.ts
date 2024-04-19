import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";
import type { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner.mjs";

import logger from "@/lib/logs/logger";
import { chatResponseEmitter } from "@/lib/events";

import { getMessageRepo } from "../Message/MessageRepo";
import type { Role } from "../Message/RoleModel";

import { StreamResponseController } from "../Thread/StreamResponseController";
import type { Thread } from "../Thread/ThreadModel";
import { getThreadRepo } from "../Thread/ThreadRepo";

import type { AgentRun, AgentRunStatus } from "../AgentRun/AgentRunModel";
import { NexusServiceRegistry, type LLMNexus, type ChatOptions } from "./LLMInterface";
import { getAgentRunRepo } from "../AgentRun/AgentRunRepo";

export class LLMNexusController {
	/**
	 * Process the Agent Run.
	 * This is called by the Queue in `AgentRunSubscriber`
	 * */
	static processResponse = async (agentRun: AgentRun) => {
		const update = (status: AgentRunStatus) =>
			getAgentRunRepo().update({ id: agentRun.id }, { status });

		await update("in_progress");
		const llmServce = NexusServiceRegistry.getService("OpenAIService");
		const tools = agentRun.agent.getTools();
		const opts: ChatOptions = {
			tools,
			model: "gpt-4-0125-preview",
			stream: agentRun.stream,
		};

		switch (agentRun.type) {
			case "getChat": {
				const response = await this.generateChatResponse({
					agentRun,
					llmServce,
					opts,
				});

				chatResponseEmitter.on("abort", ({ agentRunId }) => {
					if (agentRunId !== agentRun.id) return;
					if ("abort" in response) response.abort();
					update("cancelled");
				});

				await this.saveResponse(agentRun, response);
				break;
			}
			case "getTitle": {
				await TitleController.processResponse(llmServce, agentRun, opts);
				break;
			}
		}

		await update("completed");
	};

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
			const responseMsg = response.choices[0].message;
			await getThreadRepo().addMessage(thread, {
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
}

class TitleController {
	/**
	 * Process the Agent Run.
	 * This is called by the Queue in `AgentRunSubscriber`
	 * */
	static processResponse = async (
		llmServce: LLMNexus,
		agentRun: AgentRun,
		opts: ChatOptions
	) => {
		const res = await this.generateTitle({
			llmServce,
			agentRun,
			opts: {
				...opts,
				stream: false,
			},
		});

		await this.saveResponse(agentRun.thread, res);
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

	private static async saveResponse(thread: Thread, response: ChatCompletionRunner) {
		await response.done();
		const toolCall = await response.finalFunctionCall();
		if (!toolCall?.arguments) throw new Error("No title generated");

		const { title } = JSON.parse(toolCall.arguments);
		if (!title) throw new Error("No title generated");

		thread.title = title;
		await getThreadRepo().update(thread.id, { title });
	}
}
