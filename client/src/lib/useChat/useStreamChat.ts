import useSocket from "./useSocket";
import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";

export const useStreamChat = () => {
	const { threadId } = useConfigStore();
	const { data: messages } = useMessagesQuery(threadId);
	const { requestChatResponse, abort, loading } = useSocket();

	const requestChat = async () => {
		if (threadId) requestChatResponse(threadId);
	};

	return {
		requestChat,
		abort,
		loading,
		messages,
	};
};
