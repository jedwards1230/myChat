import { In } from "typeorm";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { MessageFile } from "./MessageFileModel";
import {
	getMessageFileRepo,
	type MessageFileMetadata,
	type PreppedFile,
} from "./MessageFileRepo";
import logger from "@/lib/logs/logger";
import type { MultipartFile } from "@fastify/multipart";

export class MessageFileController {
	static async getMessageFile(req: FastifyRequest, reply: FastifyReply) {
		const { fileId } = req.params as {
			fileId: string;
		};
		const message = req.message;
		if (!message.files) {
			return reply.status(500).send({
				error: "No message files found.",
			});
		}

		const file = message.files.find((f) => f.id === fileId);
		if (!file) {
			return reply.status(404).send({ error: "File not found." });
		}

		reply.send(file);
	}

	static async createMessageFile(req: FastifyRequest, res: FastifyReply) {
		if (!req.isMultipart()) {
			return res.status(400).send({ error: "Request must be multipart." });
		}
		try {
			const message = req.message;
			const parts = req.parts();
			const filesRaw: MultipartFile[] = [];
			const metadataRaw: MessageFileMetadata[] = [];
			for await (const part of parts) {
				if (part.type === "file") {
					filesRaw.push(part);
				} else {
					metadataRaw.push(JSON.parse(part.value as string));
				}
			}

			if (filesRaw.length !== metadataRaw.length) {
				return res.status(400).send({
					error: "File metadata mismatch.",
				});
			}

			const files: PreppedFile[] = [];
			for (let i = 0; i < filesRaw.length; i++) {
				const file = filesRaw[i];
				const metadata = metadataRaw[i];
				files.push({ file, metadata });
			}

			const newMsg = await getMessageFileRepo().addFileList(files, message);

			res.send(newMsg);
		} catch (error) {
			logger.error("Error creating message file", {
				error,
				functionName: "MessageFileController.createMessageFile",
			});
			throw error;
		}
	}

	static async getMessageFiles(req: FastifyRequest, res: FastifyReply) {
		const message = req.message;
		if (!message.files) {
			return res.status(500).send({
				error: "No message files found.",
			});
		}

		res.send(message.files);
	}

	/** 
        Files are parsed to a string in the following format:

        ```txt
        {name}.{extension}\n
        {text}
        ```
    */
	static async parseFiles(files: MessageFile[]) {
		try {
			// get fileData for all files
			const loadedFiles = await getMessageFileRepo().find({
				where: { id: In(files.map((file) => file.id)) },
				relations: ["fileData"],
			});

			const parsableFiles: MessageFile[] = [];

			const parsedFiles = loadedFiles
				.map((file) => {
					const text = file.fileData.blob.toString("utf-8");
					if (!text) return;
					file.parsable = true;
					parsableFiles.push(file);
					return `// ${file.path || file.name}\n\`\`\`\n${text}\n\`\`\``;
				})
				.filter((file) => file !== undefined);

			await getMessageFileRepo().save(parsableFiles);

			return parsedFiles.join("\n\n");
		} catch (error) {
			logger.error("Error parsing Files", {
				error,
				functionName: "MessageFileController.parseFiles",
			});
			throw error;
		}
	}
}
