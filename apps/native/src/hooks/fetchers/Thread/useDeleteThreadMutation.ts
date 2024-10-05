import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { messagesQueryOptions } from "../Message/useMessagesQuery";
import { threadListQueryOptions } from "./useThreadListQuery";
import type { ThreadDelete } from "@/types";
import { useUserData } from "../../stores/useUserData";

const deleteThread = (threadId: string, apiKey: string) =>
    fetcher<ThreadDelete>(`/threads/${threadId}`, {
        apiKey,
        method: "DELETE",
        stream: true,
    });

export function useDeleteThreadMutation() {
    const { threadId: activeThreadId, setThreadId } = useConfigStore();
    const apiKey = useUserData.use.apiKey();

    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteThread"],
        mutationFn: (threadId: string) => deleteThread(threadId, apiKey),
        onMutate: async (threadId) => {
            const sameThread = threadId === activeThreadId;
            if (sameThread) {
                setThreadId(null);
                router.push("/(app)");
                await queryClient.cancelQueries(messagesQueryOptions(apiKey, threadId));
            }
            const listQuery = threadListQueryOptions(apiKey);
            await queryClient.cancelQueries(listQuery);

            const cached = queryClient.getQueryData(listQuery.queryKey);
            const threads = (cached || []).filter((t) => t.id !== threadId);

            queryClient.setQueryData(listQuery.queryKey, threads);
            return { activeThreadId, sameThread };
        },
        onSuccess: async (_, threadId, ctx) => {
            if (ctx?.sameThread) {
                setThreadId(null);
            } else {
                await queryClient.invalidateQueries(
                    messagesQueryOptions(apiKey, threadId)
                );
            }
            await queryClient.invalidateQueries(threadListQueryOptions(apiKey));
        },
        onError: async (error, threadId, ctx) => {
            console.error("Failed to delete thread: " + error);
            setThreadId(threadId || null);
            if (ctx?.sameThread) {
                router.setParams({ c: threadId });
            }
            await queryClient.invalidateQueries(threadListQueryOptions(apiKey));
        },
    });
}
