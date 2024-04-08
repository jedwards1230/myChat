import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { FileDialog } from "@/components/views/file/FileDialog";
import { FileData } from "@/components/FileRouter";

export const FileMessage = ({ data }: { data: FileData }) => {
	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<FileDialog data={data}>
				<Text className="p-2 border rounded-md bg-secondary">
					{data.file.name}
				</Text>
			</FileDialog>
		</View>
	);
};
