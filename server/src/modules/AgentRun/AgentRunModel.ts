import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Thread } from "../Thread/ThreadModel";
import { Agent } from "../Agent/AgentModel";

export type Status =
	| "queued"
	| "in_progress"
	| "requires_action"
	| "cancelling"
	| "cancelled"
	| "failed"
	| "completed"
	| "expired";

export const statusList: Status[] = [
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

	@Column(() => Thread)
	thread: Thread;

	@Column(() => Agent)
	agent: Agent;

	/** Run Status */
	@Column({ type: "text", default: "queued" })
	status: Status;

	/** Run start time */
	@CreateDateColumn()
	createdAt: Date;
}
