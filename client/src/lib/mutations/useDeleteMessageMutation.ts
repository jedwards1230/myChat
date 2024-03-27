import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";

const deleteMessage = (threadId: string, messageId: string, userId: string) => () =>
	fetcher<string>([`/threads/${threadId}/messages/${messageId}`, userId], {
		method: "DELETE",
	});

type MutationHookReturn = UseMutationResult<string, Error, void, unknown>;

export function useDeleteMessageMutation(messageId: string): MutationHookReturn {
	const { user, threadId } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteMessage", messageId],
		mutationFn: deleteMessage(threadId!, messageId, user.id),
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: [user.id, "messages"],
			});
			queryClient.refetchQueries({
				queryKey: [user.id, threadId],
			});
		},
		onError: (error) => console.error("Failed to delete message: " + error),
	});
}
