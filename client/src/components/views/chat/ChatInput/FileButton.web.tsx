import { View, Pressable } from "react-native";

import { CacheFile } from "@/types";
import { Text } from "@/components/ui/Text";
import { useFileStore } from "@/lib/stores/fileStore";
import { MaterialIcons } from "@/components/ui/Icon";
import FileDialog from "@/components/views/file/FileDialog";

export function FileButton({ file }: { file: CacheFile }) {
	return (
		<View className="relative">
			<FileDialog
				className="transition-all rounded-lg bg-background hover:bg-foreground/20"
				file={file}
			>
				<Text className="px-4 py-2 border-2 rounded border-border text-foreground">
					{file.name}
				</Text>
			</FileDialog>
			<CloseButton file={file} />
		</View>
	);
}

function CloseButton({ file }: { file: CacheFile }) {
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
