import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const threadQueryOptions = (apiKey: string, threadId: string | null) =>
    queryOptions({
        queryKey: ["thread", threadId, apiKey],
        enabled: !!threadId,
        queryFn: () => fetcher<Thread>(`/threads/${threadId}`, { apiKey }),
    });

export const useThreadQuery = (threadId: string | null) => {
    const apiKey = useUserData((s) => s.apiKey);
    return useQuery(threadQueryOptions(apiKey, threadId));
};
