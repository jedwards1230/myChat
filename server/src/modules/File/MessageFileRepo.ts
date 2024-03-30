import type { MultipartFile } from "@fastify/multipart";

import logger from "@/lib/logs/logger";
import { AppDataSource } from "@/lib/pg";
import { MessageFile, FileData } from "@/modules/File/MessageFileModel";
import { Message } from "@/modules/Message/MessageModel";

export const getFileDataRepo = () => AppDataSource.getRepository(FileData).extend({});

export const getMessageFileRepo = () =>
	AppDataSource.getTreeRepository(MessageFile).extend({
		/** Add a list of files to the database. */
		async addFileList(
			fileList: AsyncIterableIterator<MultipartFile>,
			message: Message
		): Promise<Message> {
			try {
				const newMsg = await AppDataSource.manager.transaction(
					async (manager) => {
						const res: MessageFile[] = [];
						for await (const file of fileList) {
							const fileData = await manager.save(FileData, {
								blob: await file.toBuffer(),
							});

							const messageFile = manager.create(MessageFile, {
								name: file.filename,
								mimetype: file.mimetype,
								extension: file.filename.split(".").pop(),
								fileData,
								message,
							});

							res.push(messageFile);
						}

						const newFiles = await manager.save(MessageFile, res);

						message.files = message.files
							? message.files.concat(newFiles)
							: newFiles;
						const newMsg = await manager.save(Message, message);

						return newMsg;
					}
				);
				return newMsg;
			} catch (error) {
				logger.error("Error in MessageFileRepo.addFileList", { error });
				throw error;
			}
		},
	});
