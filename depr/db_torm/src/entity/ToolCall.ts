import type { Relation } from "typeorm";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	VersionColumn,
} from "typeorm";

import { Message } from "./Message";

export interface FunctionCall {
	arguments?: string | undefined;
	name?: string | undefined;
}

@Entity("ToolCall")
export class ToolCall extends BaseEntity {
	@PrimaryColumn({ type: "text" })
	id: string;

	@Column({ type: "jsonb", nullable: true, default: null })
	function?: FunctionCall | null;

	@Column({ type: "text", nullable: true, default: null })
	content: string | null;

	@Column({ type: "enum", enum: ["function"], default: "function" })
	type: "function" = "function" as const;

	@ManyToOne(() => Message, (message) => message.tool_calls)
	/** The Assistant Message that requested this Tool Call */
	assistantMessage?: Relation<Message>;

	@OneToOne(() => Message, (message) => message.tool_call_id)
	/** The Tool Message rendering this content */
	toolmessage?: Relation<Message>;

	@VersionColumn()
	version: number;
}
