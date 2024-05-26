import { Pressable } from "react-native";

import type { FileInformation } from "@mychat/ui/hooks/useFileInformation";
import { useHoverHelper } from "@mychat/ui/hooks/useHoverHelper";
import { Cancel } from "@mychat/ui/svg";
import { cn } from "@mychat/ui/utils";

import { useFileStore } from "../../hooks/useChat/fileStore";

export function RemoveFileButton({ file }: { file: FileInformation }) {
	const removeFile = useFileStore((state) => state.removeFile);
	const { isHover, ...helpers } = useHoverHelper();
	return (
		<Pressable
			{...helpers}
			onPress={(e) => {
				e.stopPropagation();
				removeFile(file);
			}}
			className={cn(
				"group absolute -right-2 -top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full",
				!isHover ? "bg-background" : "bg-foreground/20",
			)}
		>
			<Cancel />
		</Pressable>
	);
}

export function RemoveFolderButton({ files }: { files: FileInformation[] }) {
	const removeFiles = useFileStore((state) => state.removeFiles);
	const { isHover, ...helpers } = useHoverHelper();

	return (
		<Pressable
			{...helpers}
			onPress={(e) => {
				e.stopPropagation();
				removeFiles(files);
			}}
			className={cn(
				"absolute -right-2 -top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full",
				!isHover ? "bg-background" : "bg-foreground/20",
			)}
		>
			<Cancel className={!isHover ? "text-foreground/60" : "text-foreground"} />
		</Pressable>
	);
}
