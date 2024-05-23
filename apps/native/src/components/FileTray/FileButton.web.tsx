import { View } from "react-native";
import { FileDialog } from "@/views/file/FileDialog";

import { Text } from "@mychat/ui/native/Text";

import type { FileData } from "../FileRouter";
import { RemoveFileButton } from "./DeleteButton";

export function FileButton({ data }: { data: FileData }) {
	return (
		<View className="relative items-start">
			<FileDialog
				className="w-auto rounded-lg bg-background transition-all hover:bg-foreground/20"
				data={data}
			>
				<Text className="rounded border-2 border-border px-4 py-2 text-foreground">
					{data.file.name}
				</Text>
			</FileDialog>
			<RemoveFileButton file={data.file} />
		</View>
	);
}
