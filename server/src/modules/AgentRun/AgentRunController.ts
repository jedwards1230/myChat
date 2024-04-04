import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChatCompletionMessage } from "openai/resources/index.mjs";

import { chatResponseEmitter, type ChatResponseEmitterEvents } from "@/lib/events";
import logger from "@/lib/logs/logger";

import type { Thread } from "../Thread/ThreadModel";

import { AgentRunQueue } from "./AgentRunQueue";
import { getAgentRunRepo } from "./AgentRunRepo";
import type { RunType } from "./AgentRunModel";
import type { CreateRunBody } from "./AgentRunSchema";

export class AgentRunController {
	/** Create an Agent Run and add it to the Queue */
	static async createAndRun({
		thread,
		stream = true,
		type,
	}: {
		thread: Thread;
		stream?: boolean;
		type: RunType;
	}) {
		try {
			if (!thread?.activeMessage) throw new Error("No active message found");
			const run = await getAgentRunRepo().save({
				thread: { id: thread.id, activeMessage: thread.activeMessage },
				agent: thread.agent,
				stream,
				type,
			});
			logger.debug("Agent Run created", {
				threadId: thread.id,
				runId: run.id,
				functionName: "AgentRunController.createAndRun",
			});
			AgentRunQueue.addRunToQueue(run);
			return run;
		} catch (error) {
			logger.error("Error creating Agent Run", {
				type,
				error,
				functionName: "AgentRunController.createAndRun",
			});
		}
	}

	static async createAndRunHandler(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const { stream, type } = request.body as CreateRunBody;
		const agentRun = await AgentRunController.createAndRun({
			thread,
			stream,
			type: type as RunType,
		});

		const handleResponse = stream
			? AgentRunController.handleStream
			: AgentRunController.handleJSON;

		const response = await handleResponse(thread);

		return response;
	}

	static async handleStream(thread: Thread) {
		return new Promise<ReadableStream<any>>((resolve, reject) => {
			const streamHandler = async ({
				threadId,
				response,
			}: ChatResponseEmitterEvents["responseStreamReady"]) => {
				if (threadId !== thread.id) throw new Error("Thread ID mismatch");
				chatResponseEmitter.removeListener("responseStreamReady", streamHandler);
				resolve(response.toReadableStream());
			};

			chatResponseEmitter.on("responseStreamReady", streamHandler);
		});
	}

	static async handleJSON(thread: Thread) {
		return new Promise<ChatCompletionMessage>((resolve, reject) => {
			const jsonHandler = ({
				threadId,
				response,
			}: ChatResponseEmitterEvents["responseJSONReady"]) => {
				logger.debug("Response JSON Ready", {
					threadId,
					id: thread.id,
					response,
					functionName: "AgentRunController.handleJSON",
				});
				//if (threadId !== thread.id) throw new Error("Thread ID mismatch");
				if (threadId !== thread.id) {
					return logger.debug("Thread ID mismatch", {
						threadId,
						id: thread.id,
						functionName: "AgentRunController.handleJSON",
					});
				}
				chatResponseEmitter.removeListener("responseJSONReady", jsonHandler);
				resolve(response.choices[0].message);
			};

			logger.debug("Waiting for JSON response", {
				threadId: thread.id,
				functionName: "AgentRunController.handleJSON",
			});
			chatResponseEmitter.on("responseJSONReady", jsonHandler);
		});
	}
}
