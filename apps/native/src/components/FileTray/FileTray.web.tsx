import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { useFileStore } from "@/hooks/stores/fileStore";
import { parseLocalFiles } from "@/hooks/useFileInformation";

import { Icon } from "@mychat/ui/native/Icon";

import { FileRouter } from "../FileRouter";
import { FileButton } from "./FileButton";
import { FolderButton } from "./FolderButton";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);
	if (!fileList.length) return null;
	return (
		<View className="flex h-full max-h-96 w-full flex-1 flex-row flex-wrap items-start justify-start gap-4 overflow-y-scroll rounded px-2 pb-1 pt-3">
			<FileRouter
				data={{ files: fileList }}
				routerComponents={{
					FolderButton,
					FileButton,
				}}
			/>
		</View>
	);
}

export function FileInputButton() {
	const addFiles = useFileStore.use.addFiles();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const directoryInputRef = useRef<HTMLInputElement>(null);

	const parseFiles = async (files: FileList) => {
		const mappedFiles = Array.from(files).map((file) => ({
			name: file.name,
			size: file.size,
			uri: URL.createObjectURL(file),
			mimeType: file.type,
			lastModified: file.lastModified,
			relativePath: file.webkitRelativePath,
			file: file,
		}));
		const parsedFiles = await parseLocalFiles(mappedFiles);
		addFiles(parsedFiles);
	};

	const triggerFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return console.error("No files selected");
		await parseFiles(files);
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
				className="absolute left-0 rounded-full bg-transparent p-1 md:left-2"
			>
				<Icon
					type="FontAwesome"
					name="paperclip"
					size={22}
					className="text-foreground"
				/>
			</Pressable>

			<Pressable
				onPress={() => directoryInputRef.current?.click()}
				className="absolute left-6 rounded-full bg-transparent p-1 md:left-8"
			>
				<Icon
					type="Feather"
					name="folder"
					size={22}
					className="text-foreground"
				/>
			</Pressable>
		</>
	);
}
