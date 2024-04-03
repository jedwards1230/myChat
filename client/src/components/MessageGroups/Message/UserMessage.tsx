import { View } from "react-native";

import type { Message, MessageFile } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { Text } from "@/components/ui/Text";
import FileDialog from "@/components/views/file/FileDialog";

export const UserMessage = ({ message }: { message: Message }) => {
	return (
		<View className="w-full pl-6">
			{message.files &&
				message.files.map((file, index) => (
					<FileMessage
						key={file.name + index.toString()}
						file={file}
						messageId={message.id}
					/>
				))}
			<Markdown>{message.content}</Markdown>
		</View>
	);
};

export const FileMessage = ({
	file,
	messageId,
}: {
	file: MessageFile;
	messageId: string;
}) => {
	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<FileDialog file={{ messageId, fileId: file.id }}>
				<View className="p-2 border rounded-md bg-secondary">
					<Text>{file.name}</Text>
				</View>
			</FileDialog>
		</View>
	);
};
