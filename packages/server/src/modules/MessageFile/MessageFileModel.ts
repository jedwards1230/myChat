import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";

import { Message } from "@/modules/Message/MessageModel";
import type { MessageFileObjectSchema } from "@mychat/shared/schemas/MessageFile";

@Entity("FileData")
export class FileData extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/** File blob */
	@Column({ type: "bytea" })
	blob: Buffer;

	@OneToOne(() => MessageFile, (messageFile) => messageFile.fileData)
	@JoinColumn()
	messageFile: Relation<MessageFile>;
}

@Entity("MessageFile")
export class MessageFile extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/** Original File name */
	@Column({ type: "text" })
	name: string;

	/** Relative path */
	@Column({ type: "text", nullable: true })
	path?: string;

	/** File last modified */
	@Column({ type: "bigint", nullable: true })
	lastModified?: number;

	/** File upload date */
	@CreateDateColumn()
	uploadDate: Date;

	/** File size */
	@Column({ type: "bigint" })
	size: bigint;

	/** File mimetype */
	@Column({ type: "text" })
	mimetype: string;

	/** Vector token count */
	@Column({ type: "integer", nullable: true })
	tokenCount?: number;

	/** File extension */
	@Column({ type: "text" })
	extension: string;

	/** File data */
	@OneToOne(() => FileData, (fileData) => fileData.messageFile)
	@JoinColumn()
	fileData: Relation<FileData>;

	/** Verified parsable */
	@Column({ type: "boolean", default: false })
	parsable: boolean;

	// relation to Message.
	@ManyToOne(() => Message, (message) => message.files, {
		onDelete: "CASCADE",
	})
	message: Relation<Message>;

	toJSON(): MessageFileObjectSchema {
		return {
			id: this.id,
			name: this.name,
			path: this.path,
			lastModified: this.lastModified || null,
			uploadDate: this.uploadDate,
			size: this.size.toString(),
			mimetype: this.mimetype,
			tokenCount: this.tokenCount || undefined,
			extension: this.extension,
		};
	}
}
