import { Pressable } from "react-native";

import { useFileStore } from "@/hooks/stores/fileStore";
import { MaterialIcons } from "@/components/ui/Icon";
import { FileInformation } from "@/hooks/useFileInformation";

export function RemoveFileButton({ file }: { file: FileInformation }) {
	const removeFile = useFileStore((state) => state.removeFile);
	return (
		<Pressable
			onPress={(e) => {
				e.stopPropagation();
				removeFile(file);
			}}
			className="absolute z-10 flex items-center justify-center w-4 h-4 rounded-full -top-2 -right-2 group bg-background hover:bg-foreground/20"
		>
			<MaterialIcons
				name="close"
				size={16}
				className="text-foreground/60 group-hover:text-foreground"
			/>
		</Pressable>
	);
}

export function RemoveFolderButton({ files }: { files: FileInformation[] }) {
	const removeFiles = useFileStore((state) => state.removeFiles);
	return (
		<Pressable
			onPress={(e) => {
				e.stopPropagation();
				removeFiles(files);
			}}
			className="absolute z-10 flex items-center justify-center w-4 h-4 rounded-full -top-2 -right-2 group bg-background hover:bg-foreground/20"
		>
			<MaterialIcons
				name="close"
				size={16}
				className="text-foreground/60 group-hover:text-foreground"
			/>
		</Pressable>
	);
}
