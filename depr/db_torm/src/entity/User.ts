import type { Relation } from "typeorm";
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Agent } from "./Agent";
import { AgentTool } from "./AgentTool";
import { DatabaseDocument } from "./Document";
import { UserSession } from "./Session";
import { Thread } from "./Thread";

@Entity("User")
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255 })
	apiKey!: string;

	/** User name.
	 * Default is "New User"
	 */
	@Column({ type: "text", default: "New User" })
	name: string;

	/** Email */
	@Column({ type: "text", unique: true })
	email: string;

	/** Password */
	@Column({ type: "text", default: "" })
	password: string;

	/** Url to profile picture */
	@Column({ type: "text", default: "" })
	profilePicture?: string;

	/** Threads owned by the User. */
	@OneToMany(() => Thread, (thread) => thread.user)
	threads: Relation<Thread[]>;

	/** Agents owned by the User.
	 * Cascaded
	 */
	@OneToMany(() => Agent, (agent) => agent.owner, {
		cascade: true,
	})
	agents: Relation<Agent[]>;

	/** Agent Tools owned by the User.
	 * Cascaded.
	 */
	@OneToMany(() => AgentTool, (tool) => tool.owner, {
		cascade: true,
	})
	tools: Relation<AgentTool[]>;

	/** Default Agent when starting new chat. */
	@ManyToOne(() => Agent, {
		eager: true,
	})
	@JoinColumn()
	defaultAgent: Relation<Agent> | null;

	/** User Documents */
	@OneToMany(() => DatabaseDocument, (doc) => doc.user)
	documents: Relation<DatabaseDocument[]>;

	/** User sessions. */
	@OneToMany(() => UserSession, (session) => session.user, {
		cascade: true,
	})
	sessions: Relation<UserSession[]>;
}
