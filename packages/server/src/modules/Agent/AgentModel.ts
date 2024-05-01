import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	type Relation,
	OneToMany,
	CreateDateColumn,
	VersionColumn,
	ManyToMany,
	JoinTable,
} from "typeorm";

import { User } from "../User/UserModel";
import { Thread } from "../Thread/ThreadModel";
import { ModelMap } from "../Models/data";
import { AgentTool } from "../AgentTool/AgentToolModel";
import type { ModelApi } from "../Models/types";
import { ToolsMap } from "@mychat/shared/tools/index";

const defaultAgent: Partial<Agent> = {
	name: "myChat Agent",
	toolsEnabled: true,
	systemMessage: "You are a personal assistant.",
	model: ModelMap["gpt-4-turbo"],
};

@Entity("Agent")
export class Agent extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	/** Agent name for frontend only */
	@Column({ type: "text", default: defaultAgent.name })
	name: string = "myChat Agent";

	/** Tools available to the Agent */
	@ManyToMany(() => AgentTool, (tool) => tool.agents, { eager: true })
	@JoinTable()
	tools: Relation<AgentTool[]>;

	/** Model API for the Agent */
	@Column({ type: "jsonb", default: defaultAgent.model })
	model: ModelApi;

	/** Whether tools are enabled */
	@Column({ type: "boolean", default: defaultAgent.toolsEnabled })
	toolsEnabled: boolean = false;

	/** System message for the Agent */
	@Column({ type: "text", default: defaultAgent.systemMessage })
	systemMessage: string;

	/** Threads that the Agent is a part of */
	@OneToMany(() => Thread, (thread) => thread.agent)
	threads: Relation<Thread[]>;

	/** User that owns the Agent */
	@ManyToOne(() => User, (user) => user.agents)
	owner: Relation<User>;

	@VersionColumn()
	version: number;

	/** Get List of Agent Tools */
	getTools() {
		return this.tools.map((tool) => ToolsMap[tool.toolName]);
	}
}