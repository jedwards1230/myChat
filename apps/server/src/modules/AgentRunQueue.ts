import { logger } from "@/lib/logger";
import { pgRepo } from "@/lib/pg";
import MessageQueue from "@/lib/queue";

import type { AgentRun } from "@mychat/db/entity/AgentRun";

import { LLMNexusController } from "./LLMNexusController";

export type AddMessageQueue = MessageQueue<AgentRun>;

export class AgentRunQueue {
	private static queue: AddMessageQueue = new MessageQueue<AgentRun>();

	static addRunToQueue(run: AgentRun) {
		this.queue.enqueue(run.id, run);
		void this.processQueue(run.id);
	}

	// Process the queue asynchronously
	private static async processQueue(runId: string) {
		try {
			while (!this.queue.isEmpty(runId)) {
				const run = await pgRepo.AgentRun.getRunForProcessing(runId);
				this.queue.dequeue(runId);

				try {
					await LLMNexusController.processResponse(run);
				} catch (error) {
					logger.error("Error processing AgentRun", {
						error,
						functionName: "AgentRunQueue.processQueue",
					});
					await pgRepo.AgentRun.update({ id: run.id }, { status: "failed" });
				}
			}
		} catch (error) {
			logger.error("Error processing AgentRunQueue", {
				error,
				runId,
				functionName: "AgentRunQueue.processQueue",
			});
		}
	}
}
