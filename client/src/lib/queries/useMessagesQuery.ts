import { queryOptions, useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import { Message } from "@/types";

const fetchMessages = (userId: string, threadId: string | null) => () =>
	fetcher<Message[]>([`/threads/${threadId}/messages`, userId]);

export const messagesQueryOptions = (userId: string, threadId: string | null) => {
	return queryOptions({
		queryKey: [userId, threadId],
		enabled: !!threadId,
		queryFn: fetchMessages(userId, threadId),
		initialData: [],
	});
};

export const useMessagesQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(messagesQueryOptions(user.id, threadId));
};

export const useMessagesQueryOptions = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	return messagesQueryOptions(user.id, threadId);
};
