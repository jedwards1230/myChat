import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";
import { messagesQueryOptions } from "./useMessagesQuery";

const deleteMessage = (threadId: string, messageId: string, apiKey: string) => () =>
    fetcher<string>(`/threads/${threadId}/messages/${messageId}`, {
        method: "DELETE",
        apiKey,
    });

export function useMessageDelete(threadId: string, messageId: string) {
    const apiKey = useUserData((s) => s.apiKey);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteMessage", messageId],
        mutationFn: deleteMessage(threadId, messageId, apiKey),
        onSuccess: () =>
            queryClient.refetchQueries(messagesQueryOptions(apiKey, threadId)),
        onError: (error) => console.error("Failed to delete message: " + error),
    });
}
