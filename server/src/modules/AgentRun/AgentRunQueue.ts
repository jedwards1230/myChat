import logger from "@/lib/logs/logger";
import { LLMNexusController } from "../LLMNexus/LLMNexusController";
import { AgentRun } from "./AgentRunModel";
import { getAgentRunRepo } from "./AgentRunRepo";
import MessageQueue from "@/lib/queue";

export type AddMessageQueue = MessageQueue<AgentRun>;

export class AgentRunQueue {
	private static queue: AddMessageQueue = new MessageQueue<AgentRun>();

	static addRunToQueue(run: AgentRun) {
		this.queue.enqueue(run.id, run);
		this.processQueue(run.id);
	}

	// Process the queue asynchronously
	private static async processQueue(runId: string) {
		try {
			while (!this.queue.isEmpty(runId)) {
				const run = this.queue.dequeue(runId);
				if (!run) throw new Error("No run in queue");

				try {
					await LLMNexusController.processResponse(run);
				} catch (error) {
					logger.error("Error processing AgentRun", {
						error,
						functionName: "AgentRunQueue.processQueue",
					});
					await getAgentRunRepo().update({ id: run.id }, { status: "failed" });
				}
			}
		} catch (error) {
			logger.error("Error processing AgentRunQueue", {
				error,
				runId,
				functionName: "AgentRunQueue.processQueue",
			});
		} finally {
			this.queue.locked = false;
		}
	}
}
