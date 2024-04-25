import { View } from "react-native";

import type { Message } from "@/types";
import { MessageFilter } from "./MessageFilter";
import { Text } from "@/components/ui/Text";
import { Avatar } from "../Avatar";

export function MessagePreview({
	message,
	threadId,
}: {
	message: Message;
	threadId: string;
}) {
	const role = message.role === "user" ? "user" : "assistant";
	const name = message.name || message.role;

	return (
		<View className="min-w-full px-2 py-4 border rounded bg-background">
			<View className="flex flex-row items-center gap-2">
				<Avatar role={role} name={name} />
				<Text className="font-bold">{name}</Text>
			</View>
			<View className="w-full">
				<MessageFilter threadId={threadId} message={message} />
			</View>
		</View>
	);
}
