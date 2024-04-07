import React, { useRef } from "react";
import { Pressable, View } from "react-native";

import { useFileStore } from "@/hooks/stores/fileStore";
import { Feather, FontAwesome } from "@/components/ui/Icon";
import { CacheFile } from "@/types";
import { FileRouter } from "./FolderButton.web";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);
	if (!fileList.length) return null;
	return (
		<View className="flex flex-row flex-wrap items-start justify-start w-full gap-4 px-2 pt-3 pb-1">
			<FileRouter files={fileList} />
		</View>
	);
}

export function FileInputButton() {
	const addAssets = useFileStore((state) => state.addAssets);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const directoryInputRef = useRef<HTMLInputElement>(null);

	const triggerFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return console.error("No files selected");
		const assets: CacheFile[] = Array.from(files).map((file) => ({
			name: file.name,
			size: file.size,
			uri: URL.createObjectURL(file),
			mimeType: file.type,
			lastModified: file.lastModified,
			file: file,
		}));
		addAssets(assets);
	};

	const triggerDirectoryInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return console.error("No files selected");
		const assets: CacheFile[] = Array.from(files).map((file) => ({
			name: file.name,
			size: file.size,
			uri: URL.createObjectURL(file),
			mimeType: file.type,
			lastModified: file.lastModified,
			relativePath: file.webkitRelativePath,
			file: file,
		}));
		addAssets(assets);
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
				onChange={(e) => triggerDirectoryInput(e)}
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
