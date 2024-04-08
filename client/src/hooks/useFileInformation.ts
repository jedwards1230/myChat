import { useEffect, useMemo, useState } from "react";

import { MessageFile } from "@/types";
import { useFileSuspenseQuery } from "@/hooks/queries/useFileQuery";
import type { DocumentPickerAsset } from "expo-document-picker";
import { useFilesSuspenseQuery } from "./queries/useFilesQuery";

type CacheFile = DocumentPickerAsset;

export type FileInformation = {
	name: string;
	href: string;
	extension: string;
	size: number;
	type?: string;
	relativePath?: string;
	buffer?: ArrayBuffer;
	parsed?: string;
	parsable?: boolean;
	file?: File;
};

export type SavedFileInformation = {
	id: string;
} & FileInformation;

export type MessageQueryOpts = {
	messageId: string;
	threadId: string;
};

export type FileQueryOpts = {
	fileId: string;
} & MessageQueryOpts;

export function useFilesInformation({ threadId, messageId }: MessageQueryOpts) {
	const filesData = useFilesSuspenseQuery(threadId, messageId).data;
	return useMemo(() => {
		if (!filesData) return [];
		return filesData.map((file) => getFileInformation(file));
	}, [filesData]);
}

export function useFileInformation({ threadId, messageId, fileId }: FileQueryOpts) {
	const fileData = useFileSuspenseQuery(threadId, messageId, fileId).data;
	const [fileInformation, setFileInformation] = useState(getFileInformation(fileData));

	useEffect(() => {
		if (!fileData) return;
		const fileInfo = getFileInformation(fileData);
		if (fileInfo.parsed || fileInfo.parsable === false)
			return setFileInformation(fileInfo);

		const update = async () => {
			setFileInformation(fileInfo);
			const buffer = isDbFile(fileData)
				? await getMessageFileBuffer(fileData)
				: await getCacheFileBuffer(fileData);

			if (!buffer) {
				setFileInformation({
					...fileInformation,
					parsable: false,
				});
				return;
			}

			const decoder = new TextDecoder();
			const text = decoder.decode(new Uint8Array(buffer));
			setFileInformation({
				...fileInformation,
				parsable: true,
				parsed: text,
			});
		};
		update();
	}, [fileData]);

	return fileInformation;
}

export async function parseLocalFiles(assets: CacheFile[]) {
	const files = await Promise.all(assets.map(parseLocalFile));
	return files;
}

export async function parseLocalFile(asset: CacheFile) {
	const file = getFileInformation(asset);
	if (file.parsable === undefined) {
		const buffer = await getCacheFileBuffer(asset);
		if (!buffer)
			return {
				...file,
				parsable: false,
			};
		const decoder = new TextDecoder();
		const text = decoder.decode(new Uint8Array(buffer));
		return {
			...file,
			parsable: true,
			parsed: text,
		};
	}
	return file;
}

async function getMessageFileBuffer(
	data: MessageFile
): Promise<ArrayBufferLike | undefined> {
	if (data && data.fileData && data.fileData.blob && "data" in data.fileData.blob) {
		const buffer = new Uint8Array((data.fileData.blob as any).data).buffer;
		return buffer;
	}
}

export async function getCacheFileBuffer(
	file: DocumentPickerAsset
): Promise<ArrayBufferLike | undefined> {
	if (file.file && file.file.arrayBuffer) {
		const buffer = await file.file.arrayBuffer();
		return buffer;
	}
}

export function isLocalFile(
	file: DocumentPickerAsset | MessageFile
): file is DocumentPickerAsset {
	return "uri" in file;
}

export function isDbFile(file: DocumentPickerAsset | MessageFile): file is MessageFile {
	return "id" in file;
}

export function getFileInformation<
	T extends MessageFile | DocumentPickerAsset | CacheFile
>(file: T): T extends MessageFile ? SavedFileInformation : FileInformation {
	if (isLocalFile(file)) {
		const extension = file.name.split(".").pop();
		if (!extension) throw new Error("No extension found");
		return {
			name: file.name,
			href: file.uri,
			extension,
			relativePath: file.file?.webkitRelativePath || "",
			type: file.mimeType,
			size: file.size,
			file: file.file,
		} as T extends MessageFile ? SavedFileInformation : FileInformation;
	}

	if (isDbFile(file)) {
		return {
			id: file.id,
			name: file.name,
			href: "",
			extension: file.extension,
			relativePath: file.path,
			type: file.mimetype,
			size: file.size,
		} as T extends MessageFile ? SavedFileInformation : FileInformation;
	}

	throw new Error("Invalid file type");
}
