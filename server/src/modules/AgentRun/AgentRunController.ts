import type { FastifyReply, FastifyRequest } from "fastify";

import logger from "@/lib/logs/logger";

import type { Thread } from "../Thread/ThreadModel";
import type { SocketSession } from "@/modules/User/SessionModel";

import { getAgentRunRepo } from "./AgentRunRepo";
import type { RunType } from "./AgentRunModel";
import type { CreateRunBody } from "./AgentRunSchema";

export class AgentRunController {
	/** Create an Agent Run and add it to the Queue */
	static async createAndRun({
		thread,
		session,
		stream = true,
		type,
	}: {
		thread: Thread;
		session?: SocketSession;
		stream?: boolean;
		type: RunType;
	}) {
		try {
			if (!thread?.activeMessage) throw new Error("No active message found");
			const run = await getAgentRunRepo().insert({
				thread,
				agent: thread.agent,
				stream,
				session,
				type,
			});
			return run;
		} catch (error) {
			logger.error("Error creating Agent Run", {
				error,
				functionName: "AgentRunController.createAndRun",
			});
		}
	}

	static async createAndRunHandler(request: FastifyRequest, reply: FastifyReply) {
		const thread = request.thread;
		const { stream } = request.body as CreateRunBody;
		await AgentRunController.createAndRun({
			thread,
			stream,
			type: "getChat",
		});
		reply.send(request.user.agents);
	}
}
