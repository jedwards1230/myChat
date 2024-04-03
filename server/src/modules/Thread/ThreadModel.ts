import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToOne,
	OneToMany,
	type Relation,
	CreateDateColumn,
	UpdateDateColumn,
	VersionColumn,
} from "typeorm";

import { User } from "../User/UserModel";
import { Agent } from "../Agent/AgentModel";
import { Message } from "../Message/MessageModel";

@Entity("Thread")
export class Thread extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	lastModified: Date;

	/**
	 * The active message in the thread.
	 * This points to the current leaf message in the thread.
	 * Cascaded.
	 */
	@OneToOne(() => Message, { cascade: true })
	@JoinColumn()
	activeMessage: Relation<Message | null>;

	/**
	 * All Messages attached to thread.
	 * This is a list of ALL messages in the thread.
	 * It is not sorted or linear.
	 * Cascaded.
	 */
	@OneToMany(() => Message, (message) => message.thread, {
		cascade: true,
	})
	@JoinColumn()
	messages: Relation<Message[]>;

	/**
	 * Title of the thread.
	 * Default is null.
	 */
	@Column({ type: "text", default: null })
	title: string | null;

	/**
	 * Agent assigned to the thread.
	 * Eagerly loaded
	 */
	@ManyToOne(() => Agent, (agent) => agent.threads, {
		eager: true,
	})
	agent: Relation<Agent>;

	/** User that owns the thread. */
	@ManyToOne(() => User, (user) => user.threads)
	user: Relation<User>;

	/** Total token count */
	@Column({ type: "int", default: 0 })
	tokenCount: number;

	@VersionColumn()
	version: number;
}
