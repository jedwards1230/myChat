import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChatCompletionMessage } from "openai/resources/index.mjs";

import { chatResponseEmitter, type ChatResponseEmitterEvents } from "@/lib/events";
import logger from "@/lib/logs/logger";

import type { Thread } from "../Thread/ThreadModel";

import { AgentRunQueue } from "./AgentRunQueue";
import { getAgentRunRepo } from "./AgentRunRepo";
import type { AgentRun, RunType } from "./AgentRunModel";
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
			throw error;
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

		reply.raw.on("close", () => {
			if (reply.raw.destroyed)
				chatResponseEmitter.emit("abort", {
					agentRunId: agentRun.id,
				});
		});

		const handleResponse = stream
			? AgentRunController.handleStream
			: AgentRunController.handleJSON;

		const response = await handleResponse(agentRun);
		return response;
	}

	static async handleStream(agentRun: AgentRun) {
		return new Promise<ReadableStream<any>>((resolve, reject) => {
			const streamHandler = async ({
				agentRunId,
				response,
			}: ChatResponseEmitterEvents["responseStreamReady"]) => {
				if (agentRunId !== agentRun.id)
					logger.warn("Agent Run ID mismatch", {
						agentRunId,
						id: agentRun.id,
						functionName: "AgentRunController.handleStream",
					});

				chatResponseEmitter.removeListener("responseStreamReady", streamHandler);
				resolve(response.toReadableStream());
			};

			chatResponseEmitter.on("responseStreamReady", streamHandler);
		});
	}

	static async handleJSON(agentRun: AgentRun) {
		return new Promise<ChatCompletionMessage>((resolve, reject) => {
			const jsonHandler = ({
				agentRunId,
				response,
			}: ChatResponseEmitterEvents["responseJSONReady"]) => {
				logger.debug("Response JSON Ready", {
					agentRunId,
					id: agentRun.id,
					response,
					functionName: "AgentRunController.handleJSON",
				});
				if (agentRunId !== agentRun.id)
					logger.warn("Agent Run ID mismatch", {
						agentRunId,
						id: agentRun.id,
						functionName: "AgentRunController.handleJSON",
					});

				chatResponseEmitter.removeListener("responseJSONReady", jsonHandler);
				resolve(response.choices[0].message);
			};

			chatResponseEmitter.on("responseJSONReady", jsonHandler);
		});
	}
}
