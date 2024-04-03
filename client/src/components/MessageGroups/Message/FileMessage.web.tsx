import { View } from "react-native";

import type { MessageFile } from "@/types";
import { Text } from "@/components/ui/Text";
import FileDialog from "@/components/views/file/FileDialog";

export const FileMessage = ({
	file,
	messageId,
	threadId,
}: {
	file: MessageFile;
	messageId: string;
	threadId: string;
}) => {
	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<FileDialog file={{ messageId, fileId: file.id, threadId }}>
				<View className="p-2 border rounded-md bg-secondary">
					<Text>{file.name}</Text>
				</View>
			</FileDialog>
		</View>
	);
};
