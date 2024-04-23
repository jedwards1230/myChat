import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    type Relation,
} from "typeorm";

import { Thread } from "../Thread/ThreadModel";
import { Agent } from "../Agent/AgentModel";
import { UserSession } from "./SessionModel";
import { AgentTool } from "../AgentTool/AgentToolModel";

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
    defaultAgent: Relation<Agent>;

    /** User sessions. */
    @OneToMany(() => UserSession, (session) => session.user, {
        cascade: true,
    })
    sessions: Relation<UserSession[]>;
}
