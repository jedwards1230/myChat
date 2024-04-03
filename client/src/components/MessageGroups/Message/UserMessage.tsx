import { View } from "react-native";

import type { Message } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { FileMessage } from "./FileMessage";

export const UserMessage = ({
	message,
	threadId,
}: {
	message: Message;
	threadId: string;
}) => {
	return (
		<View className="w-full pl-6">
			{message.files &&
				message.files.map((file, index) => (
					<FileMessage
						key={file.name + index.toString()}
						file={file}
						threadId={threadId}
						messageId={message.id}
					/>
				))}
			<Markdown>{message.content}</Markdown>
		</View>
	);
};
