import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";

const fetchTitle = (threadId: string | null, userId: string) => () =>
	fetcher<string>([`/threads/title/${threadId}`, userId], { method: "POST" }, true);

export const useRequestThreadTitleMutation = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["title", threadId],
		mutationFn: fetchTitle(threadId, user.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [user.id, threadId] });
			queryClient.refetchQueries({ queryKey: [user.id, "threads"] });
		},
		onError: (error) => console.error("Failed to fetch thread title: " + error),
	});
};
