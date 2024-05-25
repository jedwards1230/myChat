import { Pressable } from "react-native";
import { useFileStore } from "@/hooks/useChat/fileStore";

import type { FileInformation } from "@mychat/ui/hooks/useFileInformation";
import { useHoverHelper } from "@mychat/ui/hooks/useHoverHelper";
import { Icon } from "@mychat/ui/native/Icon";
import { cn } from "@mychat/ui/utils";

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
			<Icon
				type="MaterialIcons"
				name="close"
				size={16}
				className={!isHover ? "text-foreground/60" : "text-foreground"}
			/>
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
			<Icon
				type="MaterialIcons"
				name="close"
				size={16}
				className={!isHover ? "text-foreground/60" : "text-foreground"}
			/>
		</Pressable>
	);
}