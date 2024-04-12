import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { threadListQueryOptions } from "../queries/useThreadListQuery";
import { ThreadDelete } from "@/types";
import { useUserData } from "../stores/useUserData";

const deleteThread = (threadId: string, apiKey: string) =>
	fetcher<ThreadDelete>(`/threads/${threadId}`, {
		apiKey,
		method: "DELETE",
	});

export function useDeleteThreadMutation() {
	const { threadId: activeThreadId, setThreadId } = useConfigStore();
	const apiKey = useUserData((s) => s.apiKey);

	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteThread"],
		mutationFn: (threadId: string) => deleteThread(threadId, apiKey),
		onSuccess: (_, threadId) => {
			if (threadId === activeThreadId) {
				setThreadId(null);
				router.push("/(chat)");
				queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId));
			}
			queryClient.invalidateQueries(threadListQueryOptions(apiKey));
		},
		onError: (error) => console.error("Failed to delete thread: " + error),
	});
}
