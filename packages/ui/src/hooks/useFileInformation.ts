import type { DocumentPickerAsset } from "expo-document-picker";
import { useEffect, useMemo, useState } from "react";

import type { CreateMessageFile, MessageFile } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useFilesInformation({ threadId, messageId }: MessageQueryOpts) {
	//const filesData = useFilesSuspenseQuery(threadId, messageId).data;
	const [filesData] = api.messageFile.all.useSuspenseQuery();
	return useMemo(
		() => (filesData.length ? filesData.map((file) => toFileInformation(file)) : []),
		[filesData],
	);
}

export function useFileInformation({ fileId }: { fileId: string }) {
	const [fileData, fileDataQuery] = api.messageFile.byId.useSuspenseQuery({
		id: fileId,
	});
	if (!fileData) throw fileDataQuery.error;

	const [fileInformation, setFileInformation] = useState(toFileInformation(fileData));

	useEffect(() => {
		if (!fileData) return;
		const fileInfo = toFileInformation(fileData);
		if (fileInfo.parsed ?? fileInfo.parsable === false)
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
	id?: number,
): FileInformation {
	if (isLocalFile(file)) {
		const extension = file.name.split(".").pop();
		if (!extension) throw new Error("No extension found");
		return {
			id: id?.toString(),
			name: file.name,
			href: file.uri,
			extension,
			relativePath: file.file?.webkitRelativePath ?? "",
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

export function toMessageFile(file: FileInformation): CreateMessageFile & { id: string } {
	return {
		id: file.id,
		name: file.name,
		extension: file.extension,
		path: file.relativePath ?? null,
		mimetype: file.type ?? "",
		size: file.size,
		lastModified: Date.now(),
		uploadDate: new Date().toLocaleString(),
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
	data: MessageFile,
): Promise<ArrayBufferLike | undefined> {
	/* if (data.fileDataId && "data" in data.fileDataId) {
		return new Uint8Array(data.fileData.blob.data).buffer;
	} */
	return new Uint8Array(data.fileDataId as any).buffer;
}

async function getCacheFileBuffer(
	file: DocumentPickerAsset,
): Promise<ArrayBufferLike | undefined> {
	if (file.file?.arrayBuffer) {
		const buffer = await file.file.arrayBuffer();
		return buffer;
	}
}

function isLocalFile(
	file: DocumentPickerAsset | MessageFile,
): file is DocumentPickerAsset {
	return "uri" in file;
}

export interface FileInformation {
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
}

export interface MessageQueryOpts {
	messageId: string;
	threadId: string;
}
