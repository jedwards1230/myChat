import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

import type { Message, SocketServerMessage } from "@/types";

export const formatUrl = (host: string, userId: string) => {
	const url = new URL(host);
	url.protocol = "ws";
	return `${url.toString()}/${userId}`;
};

export const handleSocketMessage = (
	message: SocketServerMessage,
	{
		addMessage,
		updateMessage,
		finalMessage,
	}: {
		addMessage: (message: Message) => void;
		updateMessage: (content: string) => void;
		finalMessage: () => void;
	}
) => {
	switch (message.type) {
		case "chunk":
			const delta = message.data as Message;

			if (delta.role) {
				addMessage(delta);
			}

			if (Platform.OS === "ios") {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
			break;
		case "content":
			updateMessage(message.data);
			break;
		case "finalMessage":
			finalMessage();
			break;
		case "tool":
			addMessage(message.data);
			break;
		default:
			console.log("Message - Unknown type", { message });
			break;
	}
};
