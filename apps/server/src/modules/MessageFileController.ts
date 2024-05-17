import type { FastifyReply, FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";

import { logger } from "@/lib/logger";
import tokenizer from "@mychat/agents/tokenizer";
import { pgRepo } from "@/lib/pg";

import type { DocumentMetaParams } from "@mychat/db/repository/DocumentRepo";

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
		logger.debug("Creating message file", {
			functionName: "MessageFileController.createMessageFile",
		});
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
			await MessageFileController.saveToVectorStore(files, {
				user: req.user,
				message: newMsg,
				thread: req.thread,
			});

			res.send(newMsg.toJSON());
		} catch (error) {
			logger.error("Error creating message file", {
				error,
				functionName: "MessageFileController.createMessageFile",
			});
			throw error;
		}
	}

	private static isParsable(file: PreppedFile): file is PreppedFile & { text: string } {
		return file.text !== undefined;
	}

	private static async saveToVectorStore(
		files: PreppedFile[],
		meta: DocumentMetaParams
	) {
		try {
			pgRepo["Document"].addDocuments(
				...files.filter(this.isParsable).map((file) => ({
					...meta,
					decoded: file.text,
					metadata: {
						name: file.metadata.name,
						href: file.metadata.relativePath,
						relativePath: file.metadata.relativePath,
						size: file.metadata.size,
						...("extension" in file.metadata && {
							extension: file.metadata.extension,
						}),
						...("type" in file.metadata && {
							type: file.metadata.type,
						}),
					},
				}))
			);
		} catch (error) {
			logger.error("Error saving files to vector store", {
				error,
				functionName: "MessageFileController.saveToVectorStore",
			});
			throw error;
		}
	}

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
		return res.send(req.message.files?.map((f) => f.toJSON()));
	}
}
