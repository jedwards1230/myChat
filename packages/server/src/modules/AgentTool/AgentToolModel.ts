import {
	BaseEntity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	VersionColumn,
	ManyToOne,
	type Relation,
	Entity,
	ManyToMany,
} from "typeorm";

import { Agent } from "../Agent/AgentModel";
import { User } from "../User/UserModel";
import type { ToolConfigUnion, ToolName } from "@mychat/shared/tools/index";

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
