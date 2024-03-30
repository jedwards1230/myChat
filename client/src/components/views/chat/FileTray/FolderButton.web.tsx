import { Pressable, View } from "react-native";

import { CacheFile } from "@/types";
import { Text } from "@/components/ui/Text";
import { RemoveFolderButton } from "./CloseButton";
import { useState } from "react";
import { FileButton } from "./FileButton.web";
import { cn } from "@/lib/utils";

export function FolderButton({
	baseDir,
	files,
}: {
	baseDir: string;
	files: CacheFile[];
}) {
	const [open, setOpen] = useState(false);
	const levels = baseDir.split("/").length;

	const colorMap = [
		"bg-foreground/5",
		"bg-foreground/10",
		"bg-foreground/20",
		"bg-foreground/30",
		"bg-foreground/40",
		"bg-foreground/50",
		"bg-foreground/60",
		"bg-foreground/70",
		"bg-foreground/80",
	];

	if (levels > colorMap.length)
		console.error("Too many levels in folder button", baseDir);

	return (
		<View
			className={cn(
				"flex flex-row rounded-lg flex-wrap items-start justify-start flex-shrink gap-2",
				open ? colorMap[levels] : "",
				open ? "p-1" : ""
			)}
		>
			<View className="relative">
				<Pressable onPress={() => setOpen(!open)} className="bg-foreground/5">
					<Text className="px-4 py-2 border-2 rounded border-border text-foreground">
						{baseDir}
					</Text>
				</Pressable>
				<RemoveFolderButton files={files} />
			</View>
			{open && <FileRouter files={files} parentDir={baseDir} />}
		</View>
	);
}

export function FileRouter({
	files,
	parentDir,
}: {
	files: CacheFile[];
	parentDir?: string;
}) {
	// separate folders and files
	const filesInDirectory: CacheFile[] = [];
	const standaloneFiles: CacheFile[] = [];

	files.forEach((file) => {
		if (file.relativePath) {
			if (parentDir) {
				// diff between parent dir and file relative path
				const relativePath = file.relativePath.replace(parentDir + "/", "");
				const pathParts = relativePath.split("/");
				if (pathParts.length === 1) {
					standaloneFiles.push(file);
				} else {
					filesInDirectory.push(file);
				}
			} else {
				filesInDirectory.push(file);
			}
		} else {
			standaloneFiles.push(file);
		}
	});

	const filesByBaseDir: Record<string, CacheFile[]> = filesInDirectory.reduce(
		(acc, file) => {
			if (!file.relativePath) return acc;
			let baseDir: string | undefined;
			if (parentDir) {
				const relativePath = file.relativePath.replace(parentDir + "/", "");
				const filePathParts = relativePath.split("/");
				const basePath = filePathParts.shift();
				baseDir = [parentDir, basePath].join("/");
			} else {
				const filePathParts = file.relativePath.split("/");
				baseDir = filePathParts.shift();
			}

			if (!baseDir) return acc;

			if (!acc[baseDir]) {
				acc[baseDir] = [];
			}
			acc[baseDir].push(file);
			return acc;
		},
		{} as Record<string, CacheFile[]>
	);

	return (
		<>
			{Object.entries(filesByBaseDir).map(([dir, files]) => (
				<FolderButton key={dir} baseDir={dir} files={files} />
			))}
			{standaloneFiles.map((file, index) => (
				<FileButton key={index} file={file} />
			))}
		</>
	);
}
