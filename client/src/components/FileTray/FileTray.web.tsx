import React, { useRef } from "react";
import { Pressable, View } from "react-native";

import { useFileStore } from "@/hooks/stores/fileStore";
import { Feather, FontAwesome } from "@/components/ui/Icon";
import { FileRouter } from "../FileRouter";
import { parseLocalFiles } from "@/hooks/useFileInformation";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);
	if (!fileList.length) return null;
	return (
		<View className="flex flex-row flex-wrap items-start justify-start flex-1 w-full h-full gap-4 px-2 pt-3 pb-1 overflow-y-scroll rounded max-h-96">
			<FileRouter data={{ files: fileList }} />
		</View>
	);
}

export function FileInputButton() {
	const addFiles = useFileStore((state) => state.addFiles);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const directoryInputRef = useRef<HTMLInputElement>(null);

	const parseFiles = async (files: FileList) => {
		const mappedFilesPromises = Array.from(files).map(async (file) => ({
			name: file.name,
			size: file.size,
			uri: URL.createObjectURL(file),
			mimeType: file.type,
			lastModified: file.lastModified,
			relativePath: file.webkitRelativePath,
			file: file,
		}));
		const mappedFiles = await Promise.all(mappedFilesPromises);
		const parsedFiles = await parseLocalFiles(mappedFiles);
		addFiles(parsedFiles);
	};

	const triggerFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return console.error("No files selected");
		parseFiles(files);
	};

	return (
		<>
			<input
				type="file"
				multiple
				ref={fileInputRef}
				className="hidden"
				onChange={(e) => triggerFileInput(e)}
			/>
			<input
				type="file"
				// @ts-ignore
				webkitdirectory=""
				directory=""
				ref={directoryInputRef}
				className="hidden"
				onChange={(e) => triggerFileInput(e)}
			/>
			<Pressable
				onPress={() => fileInputRef.current?.click()}
				className="absolute left-0 p-1 bg-transparent rounded-full md:left-2"
			>
				<FontAwesome name="paperclip" size={22} className="text-foreground" />
			</Pressable>

			<Pressable
				onPress={() => directoryInputRef.current?.click()}
				className="absolute p-1 bg-transparent rounded-full left-6 md:left-8"
			>
				<Feather name="folder" size={22} className="text-foreground" />
			</Pressable>
		</>
	);
}
