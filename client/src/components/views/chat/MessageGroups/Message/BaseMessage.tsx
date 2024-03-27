import { View } from "react-native";

import type { Message } from "@/types";
import { MessageActions } from "./MessageActions";
import { MessageFilter } from "./MessageFilter";

export function BaseMessage({ groupId, message }: { groupId: string; message: Message }) {
	return (
		<View className="w-full group">
			<MessageActions message={message} groupId={groupId}>
				<MessageFilter message={message} />
			</MessageActions>
		</View>
	);
}
