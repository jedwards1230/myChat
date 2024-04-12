import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { threadListQueryOptions } from "../queries/useThreadListQuery";

const fetchTitle = (threadId: string | null, userId: string) =>
	fetcher<string>(`/threads/${threadId}/runs`, {
		userId,
		method: "POST",
		body: JSON.stringify({ type: "getTitle" }),
	});

export const useRequestThreadTitleMutation = () => {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["title"],
		mutationFn: (threadId: string) => fetchTitle(threadId, user.id),
		onSettled: () => queryClient.invalidateQueries(threadListQueryOptions(user.id)),
		onError: (error) => console.error("Failed to fetch thread title: " + error),
	});
};
