import logger from "@/lib/logs/logger";
import { AppDataSource } from "@/lib/pg";
import { AgentRun } from "./AgentRunModel";

export const AgentRunRepo = AppDataSource.getTreeRepository(AgentRun).extend({
	/** Add a list of files to the database. */
	/* async addFileList(
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
	}, */
});
