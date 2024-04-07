import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { messagesQueryOptions } from "../queries/useMessagesQuery";

const deleteMessage = (threadId: string, messageId: string, userId: string) => () =>
	fetcher<string>([`/threads/${threadId}/messages/${messageId}`, userId], {
		method: "DELETE",
	});

type MutationHookReturn = UseMutationResult<string, Error, void, unknown>;

export function useDeleteMessageMutation(
	threadId: string,
	messageId: string
): MutationHookReturn {
	const { user } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteMessage", messageId],
		mutationFn: deleteMessage(threadId, messageId, user.id),
		onSuccess: () =>
			queryClient.refetchQueries(messagesQueryOptions(user.id, threadId)),
		onError: (error) => console.error("Failed to delete message: " + error),
	});
}
