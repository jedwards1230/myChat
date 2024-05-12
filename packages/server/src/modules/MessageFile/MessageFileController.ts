import { In } from "typeorm";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";

import logger from "@/lib/logs/logger";
import tokenizer from "@/lib/tokenizer";

import type { MessageFile } from "./MessageFileModel";
import { pgRepo } from "@/lib/pg";
//import vectorstore from "@/lib/langchain/vectorstore";

export type MessageFileMetadata = {
	name: string;
	size: number;
	lastModified: number;
	relativePath?: string;
};

export type PreppedFile = {
	buffer?: Buffer;
	file: MultipartFile;
	metadata: MessageFileMetadata;
	text?: string;
	tokens?: number;
};

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

		const fileBuffer = Buffer.from(JSON.stringify(file));
		reply.type("application/octet-stream");
		reply.send(fileBuffer);
	}

	static async createMessageFile(req: FastifyRequest, res: FastifyReply) {
		if (!req.isMultipart()) {
			return res.status(400).send({ error: "Request must be multipart." });
		}
		try {
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
				if (!file) throw new Error("No file found");
				const metadata = metadataRaw[i];
				if (!metadata) throw new Error("No metadata found");
				const res = await MessageFileController.tokenizeFile(file);
				files.push({ ...res, file, metadata });
			}

			const newMsg = await pgRepo["MessageFile"].addFileList(files, req.message);
			/* await MessageFileController.saveToVectorStore(files, {
				userId: req.user.id,
				messageId: newMsg.id,
				threadId: req.thread.id,
			}); */

			res.send(newMsg);
		} catch (error) {
			logger.error("Error creating message file", {
				error,
				functionName: "MessageFileController.createMessageFile",
			});
			throw error;
		}
	}

	/* private static isParsable(file: PreppedFile): file is PreppedFile & { text: string } {
		return file.text !== undefined;
	} */

	/* private static async saveToVectorStore(
		files: PreppedFile[],
		meta: { userId: string; messageId: string; threadId: string }
	) {
		vectorstore.addDocuments(
			...files.filter(MessageFileController.isParsable).map((file) => ({
				pageContent: file.text,
				metadata: {
					...file.metadata,
					...meta,
					name: file.metadata.name,
					href: file.metadata.relativePath,
					file: undefined,
					id: undefined,
					local: undefined,
					text: undefined,
				},
			}))
		);
	} */

	private static async tokenizeFile(file: MultipartFile) {
		try {
			const buffer = await file.toBuffer();
			const text = buffer.toString("utf-8");
			const tokens = tokenizer.estimateTokenCount(text);
			return { buffer, text, tokens };
		} catch (error) {
			logger.error("Error tokenizing file", {
				error,
				functionName: "MessageFileController.tokenizeFile",
			});
		}
	}

	static async getMessageFiles(req: FastifyRequest, res: FastifyReply) {
		return res.send(req.message.files);
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
			if (!files.length) throw new Error("No files found");
			const readyFiles = files.filter((file) => file.parsedText);
			const nonReadyFiles = files.filter((file) => !file.parsedText);

			// get fileData for all files
			const loadedFiles = await pgRepo["MessageFile"].find({
				where: { id: In(nonReadyFiles.map((file) => file.id)) },
				relations: ["fileData"],
			});

			const parsableFiles: MessageFile[] = [];

			const formatText = (file: MessageFile) =>
				`// ${file.path || file.name}\n\`\`\`\n${file.parsedText}\n\`\`\``;

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

			await pgRepo["MessageFile"].save(parsableFiles);

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
