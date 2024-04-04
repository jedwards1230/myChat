import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/lib/stores/configStore";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { threadListQueryOptions } from "../queries/useThreadListQuery";

const deleteThread = (threadId: string | null, userId: string) => () =>
	fetcher<string>([`/threads/${threadId}`, userId], {
		method: "DELETE",
	});

type MutationHookReturn = UseMutationResult<string, Error, void, unknown>;

export function useDeleteThreadMutation(threadId: string | null): MutationHookReturn {
	const { user, threadId: activeThreadId, setThreadId } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteThread", threadId],
		mutationFn: deleteThread(threadId, user.id),
		onSuccess: () => {
			if (threadId === activeThreadId) {
				setThreadId(null);
				queryClient.removeQueries(messagesQueryOptions(user.id, threadId));
			}
			queryClient.refetchQueries(threadListQueryOptions(user.id));
		},
		onError: (error) => console.error("Failed to delete thread: " + error),
	});
}
