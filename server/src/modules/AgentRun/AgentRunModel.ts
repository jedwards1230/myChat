import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Thread } from "../Thread/ThreadModel";
import { Agent } from "../Agent/AgentModel";
import { SocketSession } from "../User/SessionModel";

export type RunType = "getChat" | "getTitle";

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

	/** Run Type */
	@Column({ type: "text" })
	type: RunType;

	/** Should response be streamed */
	@Column({ type: "boolean", default: true })
	stream: boolean;

	/** Socket Session */
	@Column(() => SocketSession)
	session?: SocketSession;

	/** Run start time */
	@CreateDateColumn()
	createdAt: Date;
}
