import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import type { ModelApi } from "../../../agents/src/models/index";
import { Agent } from "./Agent";
import { DatabaseDocument } from "./Document";
import { Thread } from "./Thread";

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

	/** Files summoned in RAG */
	@ManyToOne(() => DatabaseDocument)
	files: DatabaseDocument[];

	/** Should response be streamed */
	@Column({ type: "boolean", default: true })
	stream: boolean;

	/** Run start time */
	@CreateDateColumn()
	createdAt: Date;
}
