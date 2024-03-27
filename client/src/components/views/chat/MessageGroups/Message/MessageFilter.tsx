import { View } from "react-native";

import Markdown from "@/components/Markdown/Markdown";
import { Textarea } from "@/components/ui/Textarea";
import { Text } from "@/components/ui/Text";
import { Message } from "@/types";
import { useGroupStore } from "../GroupStore";
import { ToolCallMessage } from "./ToolMessage";
import { UserMessage } from "./UserMessage";

export function MessageFilter({ message }: { message: Message }) {
	const { editMessageId } = useGroupStore();
	const editMode = editMessageId === message.id;

	if (editMode) {
		return (
			<Textarea
				className="bg-transparent web:focus-visible:ring-0"
				value={message.content ?? undefined}
			/>
		);
	}

	if (message.role === "tool") {
		return <ToolCallMessage message={message} />;
	}

	if (typeof message.content !== "string")
		return <Text className="pl-6 text-red-500">{JSON.stringify(message)}</Text>;

	if (message.role === "user") return <UserMessage message={message} />;

	return (
		<View className="pl-6">
			<Markdown>{message.content}</Markdown>
		</View>
	);
}