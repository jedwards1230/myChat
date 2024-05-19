import type { Message } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const messagesQueryOptions = (apiKey: string, threadId: string | null) =>
	queryOptions({
		queryKey: ["messages", threadId, apiKey],
		enabled: !!threadId,
		queryFn: () => fetcher<Message[]>(`/threads/${threadId}/messages`, { apiKey }),
		initialData: [],
	});

export const useMessagesQuery = (threadId: string | null) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(messagesQueryOptions(apiKey, threadId));
};
