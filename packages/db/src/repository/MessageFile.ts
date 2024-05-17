import { In, type DataSource } from "typeorm";

import { MessageFile } from "../entity/MessageFile";
import { logger } from "../logger";

export const extendedMessageFileRepo = (ds: DataSource) => {
	return ds.getRepository(MessageFile).extend({
		/** 
        Files are parsed to a string in the following format:

        ```txt
        {name}.{extension}\n
        {text}
        ```
    */
		async parseFiles(files: MessageFile[]) {
			try {
				if (!files.length) throw new Error("No files found");
				const readyFiles = files.filter((file) => file.parsedText);
				const nonReadyFiles = files.filter((file) => !file.parsedText);

				// get fileData for all files
				const loadedFiles = await this.find({
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

				await this.save(parsableFiles);

				return parsedFiles.join("\n\n");
			} catch (error) {
				logger.error("Error parsing Files", {
					error,
					functionName: "MessageFileController.parseFiles",
				});
				throw error;
			}
		},
	});
};
