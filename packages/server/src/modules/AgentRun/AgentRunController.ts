import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChatCompletionMessage } from "openai/resources/index.mjs";

import { chatResponseEmitter, type ChatResponseEmitterEvents } from "@/lib/events";
import logger from "@/lib/logs/logger";
import type { Thread } from "../Thread/ThreadModel";

import { AgentRunQueue } from "./AgentRunQueue";
import type { AgentRun, RunType } from "./AgentRunModel";
import type { CreateRunBody } from "@mychat/shared/schemas/AgentRun";
import type { ModelApi } from "../Models/types";
import { pgRepo } from "@/lib/pg";

export class AgentRunController {
	/** Create an Agent Run and add it to the Queue */
	static async createAndRun({
		thread,
		stream = true,
		type,
		model,
	}: {
		thread: Thread;
		stream?: boolean;
		type: RunType;
		model: ModelApi;
	}) {
		try {
			if (!thread?.activeMessage) throw new Error("No active message found");
			const run = await pgRepo["AgentRun"].save({
				thread: { id: thread.id, activeMessage: { id: thread.activeMessage.id } },
				agent: thread.agent,
				stream,
				type,
				model,
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
		const model = {
			name: "gpt-4-turbo",
			api: "openai",
		} as ModelApi;

		const agentRun = await AgentRunController.createAndRun({
			thread,
			stream,
			type: type as RunType,
			model,
		});

		reply.raw.on("close", () => {
			if (reply.raw.destroyed) {
				chatResponseEmitter.emit("abort", {
					agentRunId: agentRun.id,
				});
			}
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
				if (agentRunId !== agentRun.id) {
					logger.warn("Agent Run ID mismatch", {
						agentRunId,
						id: agentRun.id,
						functionName: "AgentRunController.handleStream",
					});
					return;
				}

				chatResponseEmitter.removeListener("responseStreamReady", streamHandler);
				resolve(response.toReadableStream());
			};

			const abortHandler = ({ agentRunId }: ChatResponseEmitterEvents["abort"]) => {
				if (agentRunId !== agentRun.id) {
					logger.warn("Agent Run ID mismatch", {
						agentRunId,
						id: agentRun.id,
						functionName: "AgentRunController.handleStream",
					});
					return;
				}

				chatResponseEmitter
					.removeListener("responseStreamReady", streamHandler)
					.removeListener("abort", abortHandler);
				reject();
			};

			chatResponseEmitter
				.on("responseStreamReady", streamHandler)
				.on("abort", abortHandler);
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
				if (response.choices.length === 0) return reject();
				const msg = response.choices[0]?.message;
				if (msg === undefined) return reject();
				resolve(msg);
			};

			const abortHandler = ({ agentRunId }: ChatResponseEmitterEvents["abort"]) => {
				if (agentRunId !== agentRun.id) {
					logger.warn("Agent Run ID mismatch", {
						agentRunId,
						id: agentRun.id,
						functionName: "AgentRunController.handleStream",
					});
					return;
				}

				chatResponseEmitter
					.removeListener("responseJSONReady", jsonHandler)
					.removeListener("abort", abortHandler);
				reject();
			};

			chatResponseEmitter
				.on("responseJSONReady", jsonHandler)
				.on("abort", abortHandler);
		});
	}
}
