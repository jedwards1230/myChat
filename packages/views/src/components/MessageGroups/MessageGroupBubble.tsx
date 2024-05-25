import { View } from "react-native";

import { Text } from "@mychat/ui/native/Text";
import { cn } from "@mychat/ui/utils";

import type { ChatMessageGroup } from "./MessageGroup";
import { Avatar } from "./Avatar";
import { BaseMessage } from "./Message/BaseMessage";

export function MessageGroupBubble({
	group,
	editMode,
	isLoading,
}: {
	group: ChatMessageGroup;
	editMode?: boolean;
	isLoading?: boolean;
}) {
	return (
		<View
			className={cn(
				"rounded border p-2",
				editMode ? "border-input bg-input/20" : "border-transparent",
			)}
		>
			<View className="flex flex-row items-center gap-2">
				<Avatar group={group} />
				<Text className="text-lg font-semibold md:font-bold">{group.name}</Text>
			</View>
			<View className={cn(editMode ? "pl-4" : "", "pt-1")}>
				{group.messages.map((message, idx) => (
					<BaseMessage
						key={message.id + idx}
						message={message}
						group={group}
						isLoading={isLoading}
					/>
				))}
			</View>
		</View>
	);
}
