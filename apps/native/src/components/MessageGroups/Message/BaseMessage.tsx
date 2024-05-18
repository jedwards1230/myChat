import { View } from "react-native";

import type { Message } from "@/types";
import { MessageActions } from "./MessageActions";
import { MessageFilter } from "./MessageFilter";
import type { ChatMessageGroup } from "../MessageGroup";
import { Text } from "@/components/ui/Text";

export function BaseMessage({
	group,
	message,
	isLoading,
}: {
	group: ChatMessageGroup;
	message: Message;
	isLoading?: boolean;
}) {
	return (
		<View className="inline-flex w-full group">
			<MessageActions message={message} group={group}>
				<MessageFilter message={message} threadId={group.threadId} />
				{isLoading && <Text>~~~</Text>}
			</MessageActions>
		</View>
	);
}
