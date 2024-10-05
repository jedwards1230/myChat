import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { FileDialog } from "@/views/file/FileDialog";
import type { FileData } from "@/components/FileRouter";
import { Icon } from "@/components/ui/Icon";

export const FileMessage = ({ data }: { data: FileData }) => {
	return (
		<View className="self-start flex-grow-0 w-auto">
			<FileDialog data={data}>
				<Text className="flex items-center gap-1 p-2 border rounded-md bg-secondary">
					<Icon type="Ionicons" name="attach" />
					{data.file.name}
				</Text>
			</FileDialog>
		</View>
	);
};
