import type { Relation } from "typeorm";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@Entity("UserSession")
export class UserSession extends BaseEntity {
	/** Session ID */
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/** Session creation date */
	@CreateDateColumn()
	createdAt: Date;

	/** User owning the session */
	@ManyToOne(() => User, (user) => user.sessions, {
		cascade: ["insert", "update"],
	})
	user: Relation<User>;

	/** Session expiration date */
	@Column({ type: "timestamp" })
	expire: Date;

	/** Session provider */
	@Column({ type: "text" })
	provider: "email";

	/** IP in use when the session was created. */
	@Column({ type: "text", nullable: true })
	ip: string;

	/** Returns true if this the current user session. */
	@Column({ type: "boolean", default: false })
	current: boolean;
}
