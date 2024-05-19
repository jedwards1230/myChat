import {
	BaseEntity,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

import tokenizer from "@mychat/agents/tokenizer";

import { Message } from "./Message";
import { Thread } from "./Thread";
import { User } from "./User";

@Entity("embed_item")
export class EmbedItem extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text", { nullable: false })
	embedding: string;
}

@Entity("document")
export class DatabaseDocument extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text")
	decoded: string;

	@Column("jsonb")
	metadata: object;

	@OneToMany(() => EmbedItem, (embedItem) => embedItem.id)
	embeddings: EmbedItem[];

	/** Token count for document contents */
	@Column("integer", { nullable: true })
	tokenCount: number | null;

	@ManyToOne(() => Thread, (thread) => thread.documents)
	thread: Thread;

	@ManyToOne(() => User, (user) => user.documents)
	user: User;

	@ManyToOne(() => Message, (message) => message.documents)
	message: Message;

	@BeforeUpdate()
	setTokenCountUpdate() {
		if (this.decoded) {
			this.tokenCount = tokenizer.estimateTokenCount(this.decoded);
		}
	}
}
