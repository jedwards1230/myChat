import { View } from "react-native";

import type { Message } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { useGroupStore } from "../GroupStore";
import { ToolCallMessage } from "./MessageTypes/ToolMessage";
import { FileMessageGroup } from "./FileMessageGroup";
import { EditableMessage } from "./MessageTypes/EditableMessage";

export function MessageFilter({
	message,
	threadId,
}: {
	message: Message;
	threadId: string;
}) {
	const isEditMode = useGroupStore.use.isEditMode();
	const editMode = isEditMode(message.id);

	if (editMode) return <EditableMessage message={message} threadId={threadId} />;

	switch (message.role) {
		case "tool": {
			return <ToolCallMessage message={message} />;
		}
		case "user": {
			return (
				<View className="w-full pl-6">
					{message.files && (
						<FileMessageGroup messageId={message.id} threadId={threadId} />
					)}
					<Markdown>{message.content}</Markdown>
				</View>
			);
		}
		case "assistant": {
			return (
				<View className="pl-6">
					<Markdown>{message.content}</Markdown>
				</View>
			);
		}
		case "system": {
			return null;
		}
	}
}
