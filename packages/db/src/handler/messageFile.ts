import { eq, inArray } from "drizzle-orm";

import type { InsertMessage, SelectMessage } from "../schema";
import type { InsertMessageFile, SelectMessageFile } from "../schema/messageFile";
import type { GetMessageFile } from "../types";
import { db } from "../client";
import { Message } from "../schema";
import { FileData, MessageFile } from "../schema/messageFile";

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
		const readyFiles = files.filter((file) => file.parsedText);
		const nonReadyFiles = files.filter((file) => !file.parsedText);

		// get fileData for all files
		const loadedFiles: GetMessageFile[] = await db.query.MessageFile.findMany({
			where: inArray(
				MessageFile.id,
				nonReadyFiles.map((file) => file.id),
			),
			with: {
				fileData: true,
			},
		});

		const parsableFiles: SelectMessageFile[] = [];

		const formatText = (file: SelectMessageFile) =>
			`// ${file.path ?? file.name}\n\`\`\`\n${file.parsedText}\n\`\`\``;

		console.log({ loadedFiles, readyFiles, parsableFiles, formatText });

		/* const parsedFiles: GetMessageFile[] = loadedFiles
			.map((file) => {
				const text = file.fileData.map((data) => data.blob.toString()).join("");
				if (!text) return;
				file.parsedText = text;
				parsableFiles.push(file);
				return file;
			})
			.filter((file) => file !== undefined)
			.concat(readyFiles.map((file) => file.id))
			.map(formatText);

		await db.update(MessageFile).set(parsableFiles);

		return parsedFiles.join("\n\n"); */

		return "";
	}

	async function addFileList(
		fileList: any[],
		message: InsertMessage,
	): Promise<SelectMessage> {
		const newMsg = await db.transaction(async (tx) => {
			for await (const { buffer, file, metadata, text, tokens } of fileList) {
				// Create and save FileData
				/* const fileData = tx.create(FileData, { blob: buffer });
				await tx.save(FileData, fileData); */
				const fileData = await tx
					.insert(FileData)
					.values({ blob: buffer })
					.returning();

				// Create and save MessageFile with reference to FileData and Message
				await tx
					.insert(MessageFile)
					.values({
						name: file.filename,
						mimetype: file.mimetype,
						extension: file.filename.split(".").pop(),
						path: metadata.relativePath,
						lastModified: metadata.lastModified,
						size: metadata.size,
						tokenCount: tokens,
						parsedText: text,
						fileData,
						message,
					} as InsertMessageFile)
					.returning();
			}

			const updatedMessage = await tx.query.Message.findFirst({
				where: eq(Message.id, message.id ?? ""),
				with: {
					files: {
						with: {
							fileData: true,
						},
					},
				},
			});

			if (!updatedMessage) throw new Error("No message found");

			return updatedMessage;
		});
		return newMsg;
	}

	return {
		...repo,
		parseFiles,
		addFileList,
	};
};
