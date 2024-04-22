import {
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    VersionColumn,
    ManyToOne,
    type Relation,
    Entity,
} from "typeorm";

import type { ToolName } from "../LLMNexus/Tools";
import { Agent } from "./AgentModel";

@Entity("AgentTool")
export class AgentTool extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "boolean", default: false })
    enabled: boolean;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "jsonb" })
    parameters: object;

    @Column({ type: "text" })
    toolName: ToolName;

    @Column({ type: "text" })
    parse: string;

    @VersionColumn()
    version: number;

    @ManyToOne(() => Agent, (agent) => agent.tools)
    agent: Relation<Agent>;
}
