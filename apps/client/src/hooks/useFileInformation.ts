import { useEffect, useMemo, useState } from "react";

import type { MessageFile } from "@/types";
import { useFileSuspenseQuery } from "@/hooks/fetchers/Message/useFileQuery";
import type { DocumentPickerAsset } from "expo-document-picker";
import { useFilesSuspenseQuery } from "./fetchers/Message/useFilesQuery";

export function useFilesInformation({ threadId, messageId }: MessageQueryOpts) {
	const filesData = useFilesSuspenseQuery(threadId, messageId).data;
	return useMemo(
		() =>
			filesData && filesData.length
				? filesData.map((file) => toFileInformation(file))
				: [],
		[filesData]
	);
}

export function useFileInformation({ threadId, messageId, fileId }: FileQueryOpts) {
	const fileData = useFileSuspenseQuery(threadId, messageId, fileId).data;
	const [fileInformation, setFileInformation] = useState(toFileInformation(fileData));

	useEffect(() => {
		if (!fileData) return;
		const fileInfo = toFileInformation(fileData);
		if (fileInfo.parsed || fileInfo.parsable === false)
			return setFileInformation(fileInfo);

		const update = async () => {
			setFileInformation(fileInfo);
			const buffer = await getMessageFileBuffer(fileData);
			if (!buffer) {
				setFileInformation({ ...fileInfo, parsable: false });
				return;
			}

			const decoder = new TextDecoder();
			const text = decoder.decode(new Uint8Array(buffer));
			setFileInformation({ ...fileInfo, parsable: true, parsed: text });
		};
		update();
	}, [fileData]);

	return fileInformation;
}

export function toFileInformation<T extends MessageFile | DocumentPickerAsset>(
	file: T,
	id?: number
): FileInformation {
	if (isLocalFile(file)) {
		const extension = file.name.split(".").pop();
		if (!extension) throw new Error("No extension found");
		return {
			id: id?.toString(),
			name: file.name,
			href: file.uri,
			extension,
			relativePath: file.file?.webkitRelativePath || "",
			type: file.mimeType,
			size: file.size,
			file: file.file,
			local: true,
		} as FileInformation;
	}

	return {
		id: file.id,
		name: file.name,
		href: "",
		extension: file.extension,
		relativePath: file.path,
		type: file.mimetype,
		size: file.size,
		parsed: file.parsedText,
		local: false,
	} as FileInformation;
}

export function toMessageFile(file: FileInformation): MessageFile {
	return {
		id: file.id,
		name: file.name,
		extension: file.extension,
		path: file.relativePath,
		mimetype: file.type || "",
		size: file.size,
		lastModified: Date.now(),
		uploadDate: new Date(),
	};
}

export async function parseLocalFiles(assets: DocumentPickerAsset[]) {
	return Promise.all(assets.map((a, i) => parseLocalFile(a, i)));
}

async function parseLocalFile(asset: DocumentPickerAsset, id: number) {
	const file = toFileInformation(asset, id);
	if (!file.parsed && file.parsable === undefined) {
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
		return new Uint8Array((data.fileData.blob as any).data).buffer;
	}
}

async function getCacheFileBuffer(
	file: DocumentPickerAsset
): Promise<ArrayBufferLike | undefined> {
	if (file.file && file.file.arrayBuffer) {
		const buffer = await file.file.arrayBuffer();
		return buffer;
	}
}

function isLocalFile(
	file: DocumentPickerAsset | MessageFile
): file is DocumentPickerAsset {
	return "uri" in file;
}

export type FileInformation = {
	id: string;
	name: string;
	href: string;
	extension: string;
	size: number;
	type?: string;
	relativePath?: string;
	buffer?: ArrayBuffer;
	parsed?: string;
	local: boolean;
	parsable?: boolean;
	file?: File;
};

export type MessageQueryOpts = {
	messageId: string;
	threadId: string;
};

export type FileQueryOpts = {
	fileId: string;
} & MessageQueryOpts;
