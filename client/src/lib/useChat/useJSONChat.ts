import { useState } from "react";

import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";
import { iseRequestJSONChatMutation } from "../mutations/useRequestJSONChatMutation";

export const useJSONChat = () => {
	const [loading, setLoading] = useState(false);
	const { threadId } = useConfigStore();

	const { data: messages } = useMessagesQuery(threadId);
	const { mutate: requestChatJSON } = iseRequestJSONChatMutation();

	const requestChat = async () => {
		if (threadId) {
			console.log("requesting chat");

			setLoading(true);
			requestChatJSON(threadId);
			//await handleChatResponseJSON(data, (chunk) => addMessage(chunk as Message));

			setLoading(false);
		}
	};

	return {
		requestChat,
		loading,
		messages,
	};
};
