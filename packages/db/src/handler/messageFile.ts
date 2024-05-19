//import { In } from "typeorm";

import type { SelectMessageFile } from "../schema/messageFile";
import { db } from "../client";
import { MessageFile } from "../schema/messageFile";

export const extendedMessageFileRepo = () => {
	const repo = db.select().from(MessageFile);

	/** 
        Files are parsed to a string in the following format:

        ```txt
        {name}.{extension}\n
        {text}
        ```
    */
	async function parseFiles(files: SelectMessageFile[]) {
		if (!files.length) throw new Error("No files found");
		/* const readyFiles = files.filter((file) => file.parsedText);
		const nonReadyFiles = files.filter((file) => !file.parsedText); */

		// get fileData for all files
		/* const loadedFiles = await repo.find({
			where: { id: In(nonReadyFiles.map((file) => file.id)) },
			relations: ["fileData"],
		});

		const parsableFiles: SelectMessageFile[] = [];

		const formatText = (file: SelectMessageFile) =>
			`// ${file.path ?? file.name}\n\`\`\`\n${file.parsedText}\n\`\`\``;

		const parsedFiles = loadedFiles
			.map((file) => {
				const text = file.fileData.blob.toString("utf-8");
				if (!text) return;
				file.parsedText = text;
				parsableFiles.push(file);
				return file;
			})
			.filter((file) => file !== undefined)
			.concat(readyFiles)
			.map(formatText);

		await repo.save(parsableFiles);

		return parsedFiles.join("\n\n"); */
	}

	/* async function addFileList(
		fileList: PreppedFile[],
		message: Message,
	): Promise<Message> {
		const newMsg = await AppDataSource.manager.transaction(async (manager) => {
			for await (const { buffer, file, metadata, text, tokens } of fileList) {
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
		});
		return newMsg;
	} */

	return {
		...repo,
		parseFiles,
		//addFileList,
	};
};
