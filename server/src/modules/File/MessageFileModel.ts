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

import { Message } from "../Message/MessageModel";

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

	/** File last modified */
	@Column({ type: "integer", nullable: true })
	lastModified?: number;

	/** File upload date */
	@CreateDateColumn()
	uploadDate: Date;

	/** File mimetype */
	@Column({ type: "text" })
	mimetype: string;

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

	// relation to Message. message can have multiple files in an array message.files
	@ManyToOne(() => Message, (message) => message.files)
	message: Relation<Message>;
}