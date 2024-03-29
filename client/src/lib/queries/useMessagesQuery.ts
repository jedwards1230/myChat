import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "../utils";
import { Message } from "@/types";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";
import { useState } from "react";

const fetchMessages = (threadId: string | null, userId: string) => () =>
	fetcher<Message[]>([`/threads/${threadId}/messages`, userId]);

export const useMessagesQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	const queryKey = [user.id, threadId];

	return useQuery({
		queryKey,
		enabled: !!threadId,
		queryFn: fetchMessages(threadId, user.id),
		retry: false,
	});
};

export const useMessagesQueryHelpers = (
	threadId: string | null,
	setLoading: (loading: boolean) => void
) => {
	const user = useConfigStore((s) => s.user);
	const queryKey = [user.id, threadId];

	const queryClient = useQueryClient();
	const { mutate: generateTitle } = useRequestThreadTitleMutation(threadId);

	/** Add a message to the cache */
	const addMessage = (message: Message) => {
		setLoading(true);
		queryClient.setQueryData<Message[]>(queryKey, (messages) =>
			messages ? [...messages, message] : [message]
		);
	};

	/** Update the last message in the cache */
	const updateMessage = (content: string) => {
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
	const finishMessage = () => {
		queryClient.invalidateQueries({ queryKey });
		queryClient.refetchQueries({ queryKey: [user.id, threadId] });
		setLoading(false);
		generateTitle();
	};

	return { addMessage, updateMessage, finishMessage };
};
