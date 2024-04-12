import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const threadQueryOptions = (userId: string, threadId: string | null) =>
	queryOptions({
		queryKey: [userId, "threads", threadId],
		enabled: !!threadId,
		queryFn: () => fetcher<Thread>(`/threads/${threadId}`, { userId }),
	});

export const useThreadQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(threadQueryOptions(user.id, threadId));
};
