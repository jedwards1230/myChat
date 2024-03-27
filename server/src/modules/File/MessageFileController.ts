import { In } from "typeorm";

import type { MessageFile } from "./MessageFileModel";
import { MessageFileRepo } from "./MessageFileRepo";

export class MessageFileController {
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
