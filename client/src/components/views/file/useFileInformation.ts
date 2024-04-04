import { useEffect, useState } from "react";

import { CacheFile, MessageFile } from "@/types";
import { useFileSuspenseQuery } from "@/lib/queries/useFileQuery";

import { FileInformation } from "./FileInformation";

export type FileMetadata = {
	fileId: string;
	messageId: string;
	threadId: string;
};

export function useFileInformation(file: CacheFile | FileMetadata): FileInformation {
	const [buffer, setBuffer] = useState<ArrayBufferLike | undefined>(undefined);
	const needsFetch = "fileId" in file && "messageId" in file;
	const fileData = needsFetch
		? useFileSuspenseQuery(file.threadId, file.messageId, file.fileId).data
		: file;

	const [fileInformation, setFileInformation] = useState<FileInformation>(
		getFileInformation(fileData)
	);

	useEffect(() => {
		if (!fileData) return;
		setFileInformation(getFileInformation(fileData));
		"extension" in fileData
			? getMessageFileBuffer(fileData).then((buffer) => setBuffer(buffer))
			: getCacheFileBuffer(fileData).then((buffer) => setBuffer(buffer));
	}, [fileData]);

	useEffect(() => {
		if (!fileInformation || fileInformation.parsed) return;
		const update = async () => {
			if (!buffer) return;
			const decoder = new TextDecoder();
			const text = decoder.decode(new Uint8Array(buffer));
			setFileInformation({
				...fileInformation,
				parsed: text,
			});
		};
		update();
	}, [buffer]);

	return fileInformation;
}

async function getMessageFileBuffer(
	data: MessageFile
): Promise<ArrayBufferLike | undefined> {
	if (data && data.fileData && data.fileData.blob && "data" in data.fileData.blob) {
		const buffer = new Uint8Array((data.fileData.blob as any).data).buffer;
		return buffer;
	}
}

async function getCacheFileBuffer(file: CacheFile): Promise<ArrayBufferLike | undefined> {
	if (file.file && file.file.arrayBuffer) {
		const buffer = await file.file.arrayBuffer();
		return buffer;
	}
}

function getFileInformation(file: CacheFile | MessageFile): FileInformation {
	if ("uri" in file) {
		return {
			name: file.name,
			href: file.uri,
			extension: file.name.split(".").pop() || undefined,
			relativePath: file.relativePath,
			type: file.mimeType,
			size: file.size ? `${file.size} bytes` : "Unknown",
		};
	}

	return {
		name: file.name,
		href: "",
		extension: file.extension,
		relativePath: file.path,
		type: file.mimetype,
		size: `${file.size} bytes`,
	};
}
