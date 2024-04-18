import { queryOptions, useQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { Message } from "@/types";

export const messagesQueryOptions = (apiKey: string, threadId: string | null) =>
	queryOptions({
		queryKey: [threadId],
		enabled: !!threadId,
		queryFn: () => fetcher<Message[]>(`/threads/${threadId}/messages`, { apiKey }),
		initialData: [],
	});

export const useMessagesQuery = (threadId: string | null) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(messagesQueryOptions(apiKey, threadId));
};

export const useMessagesQueryOptions = (threadId: string | null) => {
	const apiKey = useUserData((s) => s.apiKey);
	return messagesQueryOptions(apiKey, threadId);
};