import { queryOptions, useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import { Message } from "@/types";

export const messagesQueryOptions = (userId: string, threadId: string | null) => {
	return queryOptions({
		queryKey: [userId, threadId],
		enabled: !!threadId,
		queryFn: () => fetcher<Message[]>(`/threads/${threadId}/messages`, { userId }),
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
