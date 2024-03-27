import { View } from "react-native";

import type { Message } from "@/types";
import { MessageActions } from "./MessageActions";
import { MessageFilter } from "./MessageFilter";

export function BaseMessage({ groupId, message }: { groupId: string; message: Message }) {
	return (
		<View className="w-full group">
			<MessageFilter message={message} />
			<MessageActions message={message} groupId={groupId} />
		</View>
	);
}
