import { View } from "react-native";

import type { Message } from "@/types";
import { MessageActions } from "./MessageActions";
import { MessageFilter } from "./MessageFilter";
import { ChatMessageGroup } from "../MessageGroup";

export function BaseMessage({
	group,
	message,
}: {
	group: ChatMessageGroup;
	message: Message;
}) {
	return (
		<View className="w-full group">
			<MessageFilter message={message} threadId={group.threadId} />
			<MessageActions message={message} group={group} />
		</View>
	);
}
