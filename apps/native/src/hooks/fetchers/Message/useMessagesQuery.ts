import { queryOptions, useQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import type { Message } from "@/types";

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
