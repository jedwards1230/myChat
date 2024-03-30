import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { useFileStore } from "@/lib/stores/fileStore";
import { FileButton } from "./FileButton";
import { Feather, FontAwesome } from "@/components/ui/Icon";
import { CacheFile } from "@/types";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);

	if (!fileList.length) return null;
	return (
		<View className="flex flex-row justify-start w-full gap-4 px-2 pt-3 pb-1 overflow-x-scroll">
			{fileList.map((file, index) => (
				<FileButton key={index} file={file} />
			))}
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
		console.log("web", { assets });
		addAssets(assets);
	};

	const triggerDirectoryInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		console.log({ event, files });
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
		console.log("web", { assets });
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
