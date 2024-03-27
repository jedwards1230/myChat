import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";

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
				queryClient.removeQueries({
					queryKey: [user.id, threadId],
				});
			}
			queryClient.refetchQueries({
				queryKey: [user.id, "threads"],
			});
		},
		onError: (error) => console.error("Failed to delete thread: " + error),
	});
}
