import type { FastifyReply, FastifyRequest } from "fastify";

import logger from "@/lib/logs/logger";

import type { Thread } from "../Thread/ThreadModel";

import { AgentRunQueue } from "./AgentRunQueue";
import { getAgentRunRepo } from "./AgentRunRepo";
import type { RunType } from "./AgentRunModel";
import type { CreateRunBody } from "./AgentRunSchema";
import { chatResponseEmitter, type ChatResponseEmitterEvents } from "@/lib/events";
import type { ChatCompletion } from "openai/resources/index.mjs";

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
			const run = await getAgentRunRepo()
				.save({
					thread: { id: thread.id, activeMessage: thread.activeMessage },
					agent: thread.agent,
					stream,
					type,
				})
				.then((run) => run)
				.catch((error) => {
					logger.error("Error saving Agent Run", {
						thread,
						stream,
						type,
						error,
						functionName: "AgentRunController.createAndRun",
					});
					throw error;
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
		return new Promise<ChatCompletion>((resolve, reject) => {
			const jsonHandler = ({
				threadId,
				response,
			}: ChatResponseEmitterEvents["responseJSONReady"]) => {
				if (threadId !== thread.id) throw new Error("Thread ID mismatch");
				chatResponseEmitter.removeListener("responseJSONReady", jsonHandler);

				resolve(response);
			};

			chatResponseEmitter.on("responseJSONReady", jsonHandler);
		});
	}
}
