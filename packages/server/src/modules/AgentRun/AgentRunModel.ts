import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Thread } from "../Thread/ThreadModel";
import { Agent } from "../Agent/AgentModel";
import type { ModelApi } from "@/modules/Models/types";

export type RunType = "getChat" | "getTitle";

export type AgentRunStatus =
	| "queued"
	| "in_progress"
	| "requires_action"
	| "cancelling"
	| "cancelled"
	| "failed"
	| "completed"
	| "expired";

export const statusList: AgentRunStatus[] = [
	"queued",
	"in_progress",
	"requires_action",
	"cancelling",
	"cancelled",
	"failed",
	"completed",
	"expired",
];

@Entity("AgentRun")
export class AgentRun extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Thread, { onDelete: "CASCADE" })
	thread: Thread;

	@ManyToOne(() => Agent)
	agent: Agent;

	// model info. deep json object of text
	@Column({ type: "jsonb" })
	model: ModelApi;

	/** Run Status */
	@Column({ type: "text", default: "queued" })
	status: AgentRunStatus;

	/** Run Type */
	@Column({ type: "text" })
	type: RunType;

	/** Should response be streamed */
	@Column({ type: "boolean", default: true })
	stream: boolean;

	/** Run start time */
	@CreateDateColumn()
	createdAt: Date;
}
