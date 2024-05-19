import type { Relation } from "typeorm";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	VersionColumn,
} from "typeorm";

import type { ToolConfigUnion, ToolName } from "@mychat/agents/tools/index";

import { Agent } from "./Agent";
import { User } from "./User";

@Entity("AgentTool")
export class AgentTool extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	/** User friendly name */
	@Column({ type: "text" })
	name: string;

	@Column({ type: "boolean", default: false })
	enabled: boolean;

	@Column({ type: "text" })
	description: string;

	@Column({ type: "jsonb" })
	parameters: object;

	/** Tool name for backend */
	@Column({ type: "text" })
	toolName: ToolName;

	@VersionColumn()
	version: number;

	@ManyToMany(() => Agent, (agent) => agent.tools)
	agents: Relation<Agent[]>;

	@ManyToOne(() => User, (user) => user.tools)
	owner: Relation<User>;
}

export function fromToolConfig(tool: ToolConfigUnion): Partial<AgentTool> {
	return {
		name: tool.name,
		description: tool.description,
		parameters: {},
		toolName: tool.name,
		enabled: false,
	};
}
