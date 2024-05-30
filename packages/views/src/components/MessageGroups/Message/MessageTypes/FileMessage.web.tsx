import { View } from "react-native";

import type { FileData } from "@mychat/ui/FileRouter";
import { Text } from "@mychat/ui/native/Text";
import { Paperclip } from "@mychat/ui/svg";

import { FileDialog } from "../../../../pages/file/FileDialog";

export const FileMessage = ({ data }: { data: FileData }) => {
	return (
		<View className="w-auto flex-grow-0 self-start">
			<FileDialog data={data}>
				<Text className="flex items-center gap-1 rounded-md border bg-secondary p-2">
					<Paperclip />
					{data.file.name}
				</Text>
			</FileDialog>
		</View>
	);
};
