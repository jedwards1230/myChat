import { useEffect, useState } from "react";

import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery, useMessagesQueryHelpers } from "../queries/useMessagesQuery";
import { useRequestJSONChatMutation } from "../mutations/useRequestJSONChatMutation";
import { handleStreamResponse } from "@/utils/chat.stream";

export const useChatResponse = () => {
	const [loading, setLoading] = useState(false);
	const { threadId } = useConfigStore();

	const { addMessage, updateMessage, finishMessage } = useMessagesQueryHelpers(
		threadId,
		setLoading
	);

	const { data: messages } = useMessagesQuery(threadId);
	const { mutate: requestChatJSON, data } = useRequestJSONChatMutation();

	useEffect(() => {
		if (!data) return;
		if (data instanceof Response) {
			if (!data.body) throw new Error("No stream found");
			handleStreamResponse(data.body, {
				addMessage,
				updateMessage,
				finalMessage: () => {
					finishMessage();
					setLoading(false);
				},
			});
		} else {
			addMessage(data);
		}
	}, [data]);

	const requestChat = async () => {
		if (threadId) {
			setLoading(true);
			requestChatJSON(threadId);
		}
	};

	const abort = () => {};

	return {
		requestChat,
		abort,
		loading,
		messages,
	};
};
