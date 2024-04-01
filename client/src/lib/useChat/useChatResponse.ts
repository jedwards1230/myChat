import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";
import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import { handleStreamResponse } from "./chat.stream";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";
import type { Message } from "@/types";

export const useChatResponse = () => {
	const [loading, setLoading] = useState(false);
	const { threadId, user } = useConfigStore();
	const queryKey = [user.id, threadId];

	const queryClient = useQueryClient();
	const { mutate: generateTitle } = useRequestThreadTitleMutation(threadId);

	/** Add a message to the cache */
	const addMessage = (message: Message) => {
		setLoading(true);
		console.log("Add message");
		queryClient.setQueryData<Message[]>(queryKey, (messages) =>
			messages ? [...messages, message] : [message]
		);
	};

	/** Update the last message in the cache */
	const updateMessage = (content: string) => {
		console.log("Update message");
		queryClient.setQueryData<Message[]>(queryKey, (messages) => {
			if (!messages) return messages;
			const lastMsg = messages[messages.length - 1];
			if (lastMsg && lastMsg.role === "assistant") {
				lastMsg.content = content;
			}
			return messages;
		});
	};

	/** Finish the message */
	const finalMessage = () => {
		console.log("Final message");
		queryClient.invalidateQueries({ queryKey });
		setLoading(false);
		generateTitle();
	};

	const { data: messages } = useMessagesQuery(threadId);
	const { mutate: requestChatJSON, data, ...mut } = useRequestChatMutation();

	useEffect(() => {
		if (!data) return;
		console.log({ mut });
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
