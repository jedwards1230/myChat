import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";
import { threadListQueryOptions } from "../queries/useThreadListQuery";

const fetchTitle = (threadId: string | null, apiKey: string) =>
	fetcher<string>(`/threads/${threadId}/runs`, {
		apiKey,
		method: "POST",
		body: JSON.stringify({ type: "getTitle" }),
	});

export const useRequestThreadTitleMutation = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["title"],
		mutationFn: (threadId: string) => fetchTitle(threadId, apiKey),
		onSettled: () => queryClient.invalidateQueries(threadListQueryOptions(apiKey)),
		onError: (error) => console.error("Failed to fetch thread title: " + error),
	});
};
