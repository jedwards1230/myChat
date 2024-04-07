import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/lib/stores/configStore";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { threadListQueryOptions } from "../queries/useThreadListQuery";
import { ThreadDelete } from "@/types";

const deleteThread = (threadId: string, userId: string) =>
	fetcher<ThreadDelete>([`/threads/${threadId}`, userId], {
		method: "DELETE",
	});

export function useDeleteThreadMutation() {
	const { user, threadId: activeThreadId, setThreadId } = useConfigStore();
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteThread"],
		mutationFn: (threadId: string) => deleteThread(threadId, user.id),
		onSuccess: (deletedThread, threadId) => {
			if (threadId === activeThreadId) {
				setThreadId(null);
				router.push("/(chat)");
				queryClient.invalidateQueries(messagesQueryOptions(user.id, threadId));
			}
			queryClient.invalidateQueries(threadListQueryOptions(user.id));
		},
		onError: (error) => console.error("Failed to delete thread: " + error),
	});
}
