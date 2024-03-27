import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	type Relation,
} from "typeorm";

import { User } from "./UserModel";

@Entity("SocketSession")
export class SocketSession extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User, (user) => user.sessions)
	user: Relation<User>;
}
