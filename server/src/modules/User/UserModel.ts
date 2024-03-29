import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	type Relation,
} from "typeorm";
import { Thread } from "../Thread/ThreadModel";
import { Agent } from "../Agent/AgentModel";
import { SocketSession } from "./SessionModel";

@Entity("User")
export class User extends BaseEntity {
	@PrimaryColumn({ type: "varchar", length: 255 })
	id!: string;

	/** User name.
	 * Default is "New User"
	 */
	@Column({ type: "text", default: "New User" })
	name: string;

	/** Threads owned by the User. */
	@OneToMany(() => Thread, (thread) => thread.user)
	threads: Relation<Thread[]>;

	/** Agents owned by the User.
	 * Cascaded.
	 */
	@OneToMany(() => Agent, (agent) => agent.owner, {
		cascade: true,
	})
	agents: Relation<Agent[]>;

	/** Default Agent when starting new chat. */
	@ManyToOne(() => Agent, {
		eager: true,
	})
	@JoinColumn()
	defaultAgent: Relation<Agent>;

	/** Sessions of the User. */
	@OneToMany(() => SocketSession, (session) => session.user)
	sessions: Relation<SocketSession[]>;
}
