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
} from "typeorm";
import { User } from "../User/UserModel";
import { Thread } from "../Thread/ThreadModel";
import { ToolsMap, type ToolName } from "../LLMNexus/Tools";
import { modelMap } from "../Models/data";

const defaultAgent: Partial<Agent> = {
	name: "myChat Agent",
	tools: [ToolsMap.Browser.name, ToolsMap.Fetcher.name],
	toolsEnabled: true,
	systemMessage: "You are a personal assistant.",
	model: modelMap["gpt-4-turbo"],
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
	@Column({ type: "text", array: true, default: defaultAgent.tools })
	tools: ToolName[] = [];

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
		return this.tools.map((tool) => ToolsMap[tool]);
	}
}
