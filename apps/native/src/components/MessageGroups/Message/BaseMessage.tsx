import type { Message } from "@/types";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";

import type { ChatMessageGroup } from "../MessageGroup";
import { MessageActions } from "./MessageActions";
import { MessageFilter } from "./MessageFilter";

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
		<View className="group inline-flex w-full">
			<MessageActions message={message} group={group}>
				<MessageFilter message={message} threadId={group.threadId} />
				{isLoading && <Text>~~~</Text>}
			</MessageActions>
		</View>
	);
}
