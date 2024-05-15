import {
	BaseEntity,
	Column,
	Entity,
	EntitySchema,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Message } from "./Message";
import { Thread } from "./Thread";

export const documentQuery = {
	initExtension: `CREATE EXTENSION IF NOT EXISTS vector;`,
	dropTable: `DROP TABLE IF EXISTS embed_item;`,
	createTable: `CREATE TABLE embed_item (id bigserial PRIMARY KEY, embedding vector(1536))`,
	initIndex: `CREATE INDEX IF NOT EXISTS documents_embedding_idx ON Document USING hnsw (embedding vector_cosine_ops);`,
	fixField: `
	ALTER TABLE embed_item
	ALTER COLUMN embedding TYPE vector(1536);
`,
} as const;

export interface EmbedItem {
	id: number;
	embedding: string;
}

export const EmbedItem = new EntitySchema<EmbedItem>({
	name: "embed_item",
	columns: {
		id: {
			type: Number,
			primary: true,
			generated: true,
		},
		embedding: {
			type: String,
		},
	},
});

/* @Entity("embed_item")
export class EmbedItem extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text", { nullable: false })
	embedding: string;
}
 */

@Entity("document")
export class DatabaseDocument extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text")
	decoded: string;

	@Column("jsonb")
	metadata: object;

	@Column({ type: "int" })
	embeddingId: number;

	@ManyToOne(() => Thread, (thread) => thread.documents)
	thread: Thread;

	@ManyToOne(() => User, (user) => user.documents)
	user: User;

	@ManyToOne(() => Message, (message) => message.documents)
	message: Message;
}
