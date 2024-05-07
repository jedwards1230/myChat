import { Equal } from "typeorm";

import tokenizer from "../tokenizer";
import { AppDataSource } from "./pg";

import { User } from "@/modules/User/UserModel";
import { Agent } from "@/modules/Agent/AgentModel";
import { Thread } from "@/modules/Thread/ThreadModel";
import { Message } from "@/modules/Message/MessageModel";
import { FileData, MessageFile } from "@/modules/MessageFile/MessageFileModel";
import { AgentRun } from "@/modules/AgentRun/AgentRunModel";
import { ToolCall } from "@/modules/Message/ToolCallModel";
import { UserSession } from "@/modules/User/SessionModel";
import { AgentTool } from "@/modules/AgentTool/AgentToolModel";
import logger from "../logs/logger";
import type { PreppedFile } from "@/modules/MessageFile/MessageFileController";

export const pgRepo = {
	User: AppDataSource.getRepository(User),
	Agent: AppDataSource.getRepository(Agent),
	Thread: AppDataSource.getRepository(Thread).extend({
		/** Create and add a Message to the DB, then add and save it to the Thread */
		async addMessage(thread: Thread, message: Partial<Message>, parentId?: string) {
			const res = await AppDataSource.manager.transaction(async (manager) => {
				try {
					if (parentId) {
						message.parent = await manager.findOneByOrFail(Message, {
							id: parentId,
						});
					} else if (thread.activeMessage) {
						message.parent = thread.activeMessage;
					}

					if (!message.parent && message.role !== "system") {
						throw new Error("No parent message found");
					}

					if (message.content) {
						message.tokenCount = tokenizer.estimateTokenCount(
							message.content
						);
					}

					const newMsg = await manager
						.create(Message, { ...message, thread })
						.save();
					const threadMsgs = await manager.find(Message, {
						where: { thread: Equal(thread.id) },
					});

					thread.activeMessage = newMsg;
					thread.messages = [...threadMsgs, newMsg];
					await manager.save(Thread, thread);

					return newMsg;
				} catch (error) {
					logger.error("Error in ThreadRepo.addMessage", { error });
					throw error;
				}
			});
			return res;
		},
	}),
	Message: AppDataSource.getTreeRepository(Message),
	FileData: AppDataSource.getRepository(FileData),
	MessageFile: AppDataSource.getRepository(MessageFile).extend({
		/** Add a list of files to the database. */
		async addFileList(fileList: PreppedFile[], message: Message): Promise<Message> {
			try {
				const newMsg = await AppDataSource.manager.transaction(
					async (manager) => {
						for await (const { buffer, file, metadata, tokens } of fileList) {
							// Create and save FileData
							const fileData = manager.create(FileData, { blob: buffer });
							await manager.save(FileData, fileData);

							// Create and save MessageFile with reference to FileData and Message
							const messageFile = manager.create(MessageFile, {
								name: file.filename,
								mimetype: file.mimetype,
								extension: file.filename.split(".").pop(),
								path: metadata.relativePath,
								lastModified: metadata.lastModified,
								size: BigInt(metadata.size),
								tokenCount: tokens,
								parsable: !!tokens && tokens > 0 && buffer !== undefined,
								fileData,
								message,
							});
							await manager.save(MessageFile, messageFile);
						}

						const updatedMessage = await manager.findOne(Message, {
							where: { id: message.id },
							relations: ["files", "files.fileData"],
						});

						return updatedMessage ?? message;
					}
				);
				return newMsg;
			} catch (error) {
				logger.error("Error in MessageFileRepo.addFileList", { error });
				throw error;
			}
		},
	}),
	AgentRun: AppDataSource.getRepository(AgentRun),
	ToolCall: AppDataSource.getRepository(ToolCall),
	UserSession: AppDataSource.getRepository(UserSession),
	AgentTool: AppDataSource.getRepository(AgentTool),
};
