import { In } from "typeorm";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { MessageFile } from "./MessageFileModel";
import { MessageFileRepo } from "./MessageFileRepo";
import { MessageRepo } from "@/modules//Message/MessageRepo";

export class MessageFileController {
	static async getMessageFile(req: FastifyRequest, res: FastifyReply) {
		const { fileId } = req.params as {
			fileId: string;
		};
		const message = req.message;
		if (!message.files) {
			return res.status(500).send({
				error: "No message files found.",
			});
		}

		const file = message.files.find((f) => f.id === fileId);
		if (!file) {
			return res.status(404).send({
				error: "File not found.",
			});
		}

		res.send(file);
	}

	static async createMessageFile(req: FastifyRequest, res: FastifyReply) {
		if (!req.isMultipart()) {
			return res.status(400).send({ error: "Request must be multipart." });
		}
		const message = req.message;

		const filesRaw = req.files();
		const files = await MessageFileRepo.addFileList(filesRaw, message);

		message.files = files;
		const newMsg = await MessageRepo.save(message);

		res.send(newMsg);
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
		// get fileData for all files
		const loadedFiles = await MessageFileRepo.find({
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
				return `// ${file.name}.${file.extension}\n${text}`;
			})
			.filter((file) => file !== undefined);

		await MessageFileRepo.save(parsableFiles);

		return parsedFiles.join("\n\n");
	}
}
