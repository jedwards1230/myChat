import { ActivityIndicator, View } from "react-native";

import type { Message } from "@/types";
import { useGroupStore } from "./GroupStore";
import { MessageGroupBubble } from "./MessageGroupBubble";

export type ChatMessageGroup = {
	id: string;
	messages: Message[];
	name: string;
	role: "user" | "assistant";
};

export const MessageGroup = ({
	item,
	index,
	isLoading,
	messageGroups,
}: {
	item: ChatMessageGroup;
	index: number;
	isLoading: boolean;
	messageGroups: ChatMessageGroup[];
}) => {
	const isLastMessageGroup = index === messageGroups.length - 1;
	const editGroupId = useGroupStore((s) => s.editGroupId);
	const editMode = editGroupId === item.id;

	return (
		<View className="w-full web:md:max-w-[90%] web:lg:max-w-[75%] mx-auto">
			<MessageGroupBubble editMode={editMode} group={item} />
			{isLoading && isLastMessageGroup && <ActivityIndicator />}
		</View>
	);
};

export const groupMessages = (messages: Message[] | undefined) => {
	if (!messages) return [];
	const grouped: ChatMessageGroup[] = [];

	const resetGroup = (): ChatMessageGroup => ({
		messages: [],
		name: "user",
		role: "user",
		id: "",
	});

	let currentGroup: ChatMessageGroup = resetGroup();
	let lastRole = "";

	messages.forEach((message, index) => {
		if (
			// Finish group if the role changes and the current group has messages
			message.role !== lastRole &&
			currentGroup.messages.length > 0 &&
			// Assistant and Tool messages should be grouped together
			!(
				(message.role === "assistant" && lastRole === "tool") ||
				(message.role === "tool" && lastRole === "assistant")
			)
		) {
			grouped.push(currentGroup);
			currentGroup = resetGroup();
		}

		currentGroup.role = message.role === "user" ? "user" : "assistant";
		lastRole = message.role;

		// Set the group name to the sender
		if (message.role !== "tool") {
			currentGroup.name = message.name || message.role;
			currentGroup.id = message.id;
		}

		// Add the message to the group
		if (message.content !== null) {
			if (message.role === "system") return;
			currentGroup.messages.push(message);
		}

		// Finish the group if this is the last message
		if (index === messages.length - 1) {
			grouped.push(currentGroup);
		}
	});

	return grouped;
};