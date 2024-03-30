import {
	EntityManager,
	EventSubscriber,
	type EntitySubscriberInterface,
	type InsertEvent,
	type UpdateEvent,
} from "typeorm";

import logger from "@/lib/logs/logger";
import { AgentRun } from "./AgentRunModel";
import { LLMNexusController } from "../LLMNexus/LLMNexusController";

type QueueItem = [AgentRun, EntityManager];

@EventSubscriber()
export class AgentRunSubscriber implements EntitySubscriberInterface<AgentRun> {
	/** Internal queue to store queued AgentRun entities */
	private queue: QueueItem[] = [];
	/** Flag to prevent concurrent processing */
	private isProcessing = false;

	listenTo() {
		return AgentRun;
	}

	// Handle AgentRun insertion
	async afterInsert(event: InsertEvent<AgentRun>) {
		const agentRun = event.entity;
		if (agentRun.status === "queued") {
			this.queue.push([agentRun, event.manager]);
			this.processQueue();
		}
	}

	// Handle AgentRun updates (for status changes)
	async afterUpdate(event: UpdateEvent<AgentRun>) {
		const agentRun = event.entity;
		if (agentRun && agentRun.status !== "queued") {
			// Remove completed/failed runs from the queue
			this.queue = this.queue.filter(([run]) => run.id !== agentRun.id);
		}
	}

	// Process the queue asynchronously
	private async processQueue() {
		if (this.queue.length === 0 || this.isProcessing) return;
		this.isProcessing = true;
		const queueItem = this.queue.shift();
		if (!queueItem) return;

		const [agentRun, manager] = queueItem;
		try {
			await LLMNexusController.processResponse(agentRun);
		} catch (error) {
			logger.error("Error processing AgentRun", {
				error,
				functionName: "AgentRunSubscriber.processQueue",
			});
			await manager.update(AgentRun, { id: agentRun.id }, { status: "failed" });
		} finally {
			this.isProcessing = false;
			this.processQueue();
		}
	}
}
