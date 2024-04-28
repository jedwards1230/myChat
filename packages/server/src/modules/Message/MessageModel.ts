import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Tree,
	TreeChildren,
	TreeParent,
	ManyToOne,
	type Relation,
	OneToMany,
	CreateDateColumn,
	JoinColumn,
	OneToOne,
	VersionColumn,
	BeforeUpdate,
} from "typeorm";

import { Thread } from "../Thread/ThreadModel";
import { type Role, roleList } from "./RoleModel";
import { ToolCall } from "./ToolCallModel";
import { MessageFile } from "../MessageFile/MessageFileModel";
import tokenizer from "@/lib/tokenizer";

@Entity("Message")
@Tree("closure-table")
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/** Thread that the message is a part of. */
	@ManyToOne(() => Thread, (thread) => thread.messages, {
		onDelete: "CASCADE",
	})
	thread: Relation<Thread>;

	/**
	 * Content of the message.
	 * The front end will not render null values.
	 * */
	@Column({ type: "text", nullable: true, default: null })
	content: string | null;

	@Column({
		type: "enum",
		enum: roleList,
	})
	role!: Role;

	@Column({ type: "text", nullable: true })
	name?: string | null;

	@CreateDateColumn()
	createdAt: Date;

	/** Tool calls requested by the model. */
	@OneToMany(() => ToolCall, (toolCall) => toolCall.assistantMessage, {
		cascade: true,
	})
	tool_calls?: ToolCall[];

	/** Tool call that the message was processed for. */
	@OneToOne(() => ToolCall, (toolCall) => toolCall.toolmessage, { cascade: true })
	@JoinColumn()
	tool_call_id?: ToolCall;

	/** Files associated with the message */
	@OneToMany(() => MessageFile, (file) => file.message, { cascade: true })
	files?: MessageFile[];

	@TreeChildren()
	children: Message[];

	/** Token Count */
	@Column({ type: "integer", default: 0 })
	tokenCount: number;

	@TreeParent()
	parent: Message;

	@VersionColumn()
	version: number;

	@BeforeUpdate()
	setTokenCountUpdate() {
		if (this.content) {
			this.tokenCount = tokenizer.estimateTokenCount(this.content);
		}
	}
}

/* export class UserMessage extends Message {
	@Column({
		default: "user",
		readonly: true,
	})
	role: Role = "user";
}

export class AssistantMessage extends Message {
	@Column({
		default: "assistant",
		readonly: true,
	})
	role: Role = "assistant";
}

export class SystemMessage extends Message {
	@Column({
		default: "system",
		readonly: true,
	})
	role: Role = "system";
}

export class ToolMessage extends Message {
	@Column({
		default: "tool",
		readonly: true,
	})
	role: Role = "tool";
} */
