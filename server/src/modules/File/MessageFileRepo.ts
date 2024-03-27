import type { MultipartFile } from "@fastify/multipart";

import logger from "@/lib/logs/logger";
import { AppDataSource } from "@/lib/pg";
import { MessageFile, FileData } from "@/modules/File/MessageFileModel";

export const FileDataRepo = AppDataSource.getRepository(FileData).extend({});

export const MessageFileRepo = AppDataSource.getTreeRepository(MessageFile).extend({
	/** Add a list of files to the database. */
	async addFileList(
		fileList: AsyncIterableIterator<MultipartFile>
	): Promise<MessageFile[]> {
		try {
			const res: MessageFile[] = [];
			for await (const file of fileList) {
				const fileData = await FileDataRepo.save({
					blob: await file.toBuffer(),
				});

				const messageFile = MessageFileRepo.create({
					name: file.filename,
					mimetype: file.mimetype,
					extension: file.filename.split(".").pop(),
					fileData,
				});

				const newFile = await MessageFileRepo.save(messageFile);
				res.push(newFile);
			}
			return res;
		} catch (error) {
			logger.error("Error in MessageFileRepo.addFileList", { error });
			throw error;
		}
	},
});
