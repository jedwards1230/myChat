import type { MultipartFile } from "@fastify/multipart";

import logger from "@/lib/logs/logger";
import { AppDataSource } from "@/lib/pg";
import { MessageFile, FileData } from "@/modules/File/MessageFileModel";
import { Message } from "@/modules/Message/MessageModel";

export const FileDataRepo = AppDataSource.getRepository(FileData).extend({});

export const MessageFileRepo = AppDataSource.getTreeRepository(MessageFile).extend({
	/** Add a list of files to the database. */
	async addFileList(
		fileList: AsyncIterableIterator<MultipartFile>,
		message: Message
	): Promise<MessageFile[]> {
		try {
			return AppDataSource.manager.transaction(async (manager) => {
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

					const newFile = await manager.save(MessageFile, messageFile);
					res.push(newFile);
				}
				return res;
			});
		} catch (error) {
			logger.error("Error in MessageFileRepo.addFileList", { error });
			throw error;
		}
	},
});
