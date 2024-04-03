import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { messagesQueryOptions, useMessagesQuery } from "../queries/useMessagesQuery";
import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import { handleStreamResponse } from "./chat.stream";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";
import type { Message } from "@/types";

export const useChatResponse = () => {
	const [loading, setLoading] = useState(false);
	const { threadId, user } = useConfigStore();
	const messagesQuery = messagesQueryOptions(user.id, threadId);

	const queryClient = useQueryClient();
	const { data: messages } = useMessagesQuery(threadId);
	const { mutate: requestChatJSON, data, ...mut } = useRequestChatMutation();
	const { mutate: generateTitle } = useRequestThreadTitleMutation(threadId);

	/** Add a message to the cache */
	const addMessage = (message: Message) => {
		setLoading(true);
		queryClient.setQueryData<Message[]>(messagesQuery.queryKey, (messages) =>
			messages ? [...messages, message] : [message]
		);
	};

	/** Update the last message in the cache */
	const updateMessage = (content: string) => {
		queryClient.setQueryData<Message[]>(messagesQuery.queryKey, (messages) => {
			if (!messages) throw new Error("No messages found");
			const lastMsg = messages[messages.length - 1];
			if (lastMsg && lastMsg.role === "assistant") {
				console.log(`Setting ${lastMsg.content} to ${content}`);
				lastMsg.content = content;
			} else {
				console.error("No assistant message found");
			}
			return messages;
		});
	};

	/** Finish the message */
	const finalMessage = () => {
		queryClient.invalidateQueries(messagesQuery);
		setLoading(false);
		generateTitle();
	};

	useEffect(() => {
		if (!data) return;
		if (data instanceof Response) {
			if (!data.body) throw new Error("No stream found");
			handleStreamResponse(data.body, {
				addMessage,
				updateMessage,
				finalMessage,
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
