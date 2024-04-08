import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { FileDialog } from "@/components/views/file/FileDialog";
import { RemoveFileButton } from "./DeleteButton";
import { FileData } from "../FileRouter";

export function FileButton({ data }: { data: FileData }) {
	return (
		<View className="relative items-start">
			<FileDialog
				className="w-auto transition-all rounded-lg bg-background hover:bg-foreground/20"
				data={data}
			>
				<Text className="px-4 py-2 border-2 rounded border-border text-foreground">
					{data.file.name}
				</Text>
			</FileDialog>
			<RemoveFileButton file={data.file} />
		</View>
	);
}
