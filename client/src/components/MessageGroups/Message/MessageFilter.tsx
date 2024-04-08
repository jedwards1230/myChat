import { View } from "react-native";

import type { Message } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { Textarea } from "@/components/ui/Textarea";
import { useGroupStore } from "../GroupStore";
import { ToolCallMessage } from "./MessageTypes/ToolMessage";
import { FileMessageGroup } from "./FileMessageGroup";

export function MessageFilter({
	message,
	threadId,
}: {
	message: Message;
	threadId: string;
}) {
	const { editMessageId } = useGroupStore();
	const editMode = editMessageId === message.id;

	if (editMode) {
		return (
			<Textarea
				className="px-2 py-1 bg-transparent web:focus-visible:ring-0"
				value={message.content ?? undefined}
			/>
		);
	}

	switch (message.role) {
		case "tool":
			return <ToolCallMessage message={message} />;
		case "user":
			return (
				<View className="w-full pl-6">
					{message.files && (
						<FileMessageGroup messageId={message.id} threadId={threadId} />
					)}
					<Markdown>{message.content}</Markdown>
				</View>
			);
		case "assistant":
			return (
				<View className="pl-6">
					<Markdown>{message.content}</Markdown>
				</View>
			);
		case "system":
			return null;
	}
}
