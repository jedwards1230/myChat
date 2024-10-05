import type { FileInformation } from "@/hooks/useFileInformation";
import { Pressable } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { useFileStore } from "@/hooks/stores/fileStore";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import { cn } from "@/lib/utils";

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
