import type { FileData } from "@/components/FileRouter";
import { View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { FileDialog } from "@/views/file/FileDialog";

export const FileMessage = ({ data }: { data: FileData }) => {
	return (
		<View className="w-auto flex-grow-0 self-start">
			<FileDialog data={data}>
				<Text className="flex items-center gap-1 rounded-md border bg-secondary p-2">
					<Icon type="Ionicons" name="attach" />
					{data.file.name}
				</Text>
			</FileDialog>
		</View>
	);
};
