import { View } from "react-native";
import { FileDialog } from "@/views/file/FileDialog";

import { Icon } from "@mychat/ui/native/Icon";
import { Text } from "@mychat/ui/native/Text";

import type { FileData } from "~/FileRouter";

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
