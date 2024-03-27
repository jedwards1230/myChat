import { Pressable, View } from "react-native";
import { useState } from "react";

import type { Message, MessageFile } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { Text } from "@/components/ui/Text";

export const UserMessage = ({ message }: { message: Message }) => {
	return (
		<View className="w-full pl-6">
			{message.files &&
				message.files.map((file, index) => (
					<MessageFiles key={file.name + index.toString()} file={file} />
				))}
			<Markdown>{message.content}</Markdown>
		</View>
	);
};

export const MessageFiles = ({ file }: { file: MessageFile | File }) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<View>
				<Pressable
					className="p-2 border rounded-md bg-secondary"
					onPress={toggleVisibility}
				>
					<Text>{file.name}</Text>
				</Pressable>
			</View>
			{isVisible && (
				<View>
					<Markdown>{"```\n" + file.name + "\n```"}</Markdown>
				</View>
			)}
		</View>
	);
};
