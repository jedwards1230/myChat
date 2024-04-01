import type { MultipartFile } from "@fastify/multipart";

import logger from "@/lib/logs/logger";
import { AppDataSource } from "@/lib/pg";
import { MessageFile, FileData } from "@/modules/MessageFile/MessageFileModel";
import { Message } from "@/modules/Message/MessageModel";

export type MessageFileMetadata = {
	name: string;
	size: number;
	lastModified: number;
	relativePath?: string;
};

export type PreppedFile = { file: MultipartFile; metadata: MessageFileMetadata };

export const getFileDataRepo = () => AppDataSource.getRepository(FileData).extend({});

export const getMessageFileRepo = () =>
	AppDataSource.getTreeRepository(MessageFile).extend({
		/** Add a list of files to the database. */
		async addFileList(fileList: PreppedFile[], message: Message): Promise<Message> {
			try {
				const newMsg = await AppDataSource.manager.transaction(
					async (manager) => {
						for await (const { file, metadata } of fileList) {
							// Create and save FileData
							const fileData = manager.create(FileData, {
								blob: await file.toBuffer(),
							});
							await manager.save(FileData, fileData);

							// Create and save MessageFile with reference to FileData and Message
							const messageFile = manager.create(MessageFile, {
								name: file.filename,
								mimetype: file.mimetype,
								extension: file.filename.split(".").pop(),
								path: metadata.relativePath,
								lastModified: metadata.lastModified,
								size: BigInt(metadata.size),
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
	});
