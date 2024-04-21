import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

export const filesQueryOptions = (apiKey: string, threadId: string, messageId: string) =>
    queryOptions({
        queryKey: ["files", threadId, messageId, apiKey],
        enabled: !!threadId && !!messageId,
        queryFn: () =>
            fetcher<MessageFile[]>(`/threads/${threadId}/messages/${messageId}/files`, {
                apiKey,
            }),
    });

export const useFilesSuspenseQuery = (threadId: string, messageId: string) => {
    const apiKey = useUserData.use.apiKey();
    return useSuspenseQuery(filesQueryOptions(apiKey, threadId, messageId));
};
