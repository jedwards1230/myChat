import { Equal } from "typeorm";

import tokenizer from "@mychat/agents/tokenizer";
import { logger } from "@/lib/logger";

import type { PreppedFile } from "@/modules/MessageFileController";

import { AppDataSource } from "@mychat/db/index";
import { User } from "@mychat/db/entity/User";
import { Agent } from "@mychat/db/entity/Agent";
import { Thread } from "@mychat/db/entity/Thread";
import { Message } from "@mychat/db/entity/Message";
import { EmbedItem } from "@mychat/db/entity/Document";
import { FileData, MessageFile } from "@mychat/db/entity/MessageFile";
import { ToolCall } from "@mychat/db/entity/ToolCall";
import { UserSession } from "@mychat/db/entity/Session";
import { AgentTool } from "@mychat/db/entity/AgentTool";

import { extendedDocumentRepo } from "@mychat/db/repository/DocumentRepo";
import { extendedAgentRunRepo } from "@mychat/db/repository/AgentRun";
import { extendedMessageRepo } from "@mychat/db/repository/Message";
import { extendedMessageFileRepo } from "@mychat/db/repository/MessageFile";

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
	Message: extendedMessageRepo(AppDataSource),
	Document: extendedDocumentRepo(AppDataSource),
	EmbedItem: AppDataSource.getRepository(EmbedItem),
	FileData: AppDataSource.getRepository(FileData),
	MessageFile: extendedMessageFileRepo(AppDataSource).extend({
		/** Add a list of files to the database. */
		async addFileList(fileList: PreppedFile[], message: Message): Promise<Message> {
			try {
				const newMsg = await AppDataSource.manager.transaction(
					async (manager) => {
						for await (const {
							buffer,
							file,
							metadata,
							text,
							tokens,
						} of fileList) {
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
								parsedText: text,
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
	AgentRun: extendedAgentRunRepo(AppDataSource),
	ToolCall: AppDataSource.getRepository(ToolCall),
	UserSession: AppDataSource.getRepository(UserSession),
	AgentTool: AppDataSource.getRepository(AgentTool),
};
