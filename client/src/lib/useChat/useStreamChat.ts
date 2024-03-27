import { useState } from "react";

import useSocket from "./useSocket";
import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";

export const useStreamChat = () => {
	const [loading, setLoading] = useState(false);
	const { threadId } = useConfigStore();

	const { data: messages } = useMessagesQuery(threadId);
	const { requestChatResponse } = useSocket(setLoading);

	const requestChat = async () => {
		if (threadId) {
			await requestChatResponse(threadId);
		}
	};

	return {
		requestChat,
		loading,
		messages,
	};
};
