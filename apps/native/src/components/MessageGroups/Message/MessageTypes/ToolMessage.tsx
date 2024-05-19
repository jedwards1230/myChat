import type { Message } from "@/types";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Markdown from "@/components/Markdown/Markdown";
import { Text } from "@/components/ui/Text";

export const ToolCallMessage = ({ message }: { message: Message }) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	if (!message.content) return null;
	let result;
	try {
		result = JSON.parse(message.content);
	} catch (e) {
		console.error(e, message);
		result = message.content;
	}

	return (
		<View className="pl-6">
			<View>
				<Pressable
					className="rounded-md border bg-secondary p-2"
					onPress={toggleVisibility}
				>
					<Text>{message.name}</Text>
				</Pressable>
			</View>
			{isVisible && (
				<View>
					<Markdown>
						{"```\n" + JSON.stringify(result, null, 4) + "\n```"}
					</Markdown>
				</View>
			)}
		</View>
	);
};
