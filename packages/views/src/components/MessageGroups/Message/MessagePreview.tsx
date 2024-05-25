import { View } from "react-native";

import type { InferResultType } from "@mychat/db/types";
import { Text } from "@mychat/ui/native/Text";

import { Avatar } from "../Avatar";
import { MessageFilter } from "./MessageFilter";

export function MessagePreview({
	message,
	threadId,
}: {
	message: InferResultType<"Message", { files: true }>;
	threadId: string;
}) {
	const role = message.role === "user" ? "user" : "assistant";
	const name = message.name ?? message.role;

	return (
		<View className="min-w-full rounded border bg-background px-2 py-4">
			<View className="flex flex-row items-center gap-2">
				<Avatar group={{ role, name }} />
				<Text className="font-bold">{name}</Text>
			</View>
			<View className="w-full">
				<MessageFilter threadId={threadId} message={message} />
			</View>
		</View>
	);
}
