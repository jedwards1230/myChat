import { View } from "react-native";

import { CacheFile } from "@/types";
import { Text } from "@/components/ui/Text";
import FileDialog from "@/components/views/file/FileDialog";
import { RemoveFileButton } from "./CloseButton";

export function FileButton({ file }: { file: CacheFile }) {
	return (
		<View className="relative items-start">
			<FileDialog
				className="w-auto transition-all rounded-lg bg-background hover:bg-foreground/20"
				file={file}
			>
				<Text className="px-4 py-2 border-2 rounded border-border text-foreground">
					{file.name}
				</Text>
			</FileDialog>
			<RemoveFileButton file={file} />
		</View>
	);
}
