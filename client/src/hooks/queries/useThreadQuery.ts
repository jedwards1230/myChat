import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { queryOptions, useQuery } from "@tanstack/react-query";

const fetchThread = (userId: string, threadId: string | null) => () =>
	fetcher<Thread>([`/threads/${threadId}`, userId]);

export const threadQueryOptions = (userId: string, threadId: string | null) => {
	return queryOptions({
		queryKey: [userId, "threads", threadId],
		enabled: !!threadId,
		queryFn: fetchThread(userId, threadId),
	});
};

export const useThreadQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(threadQueryOptions(user.id, threadId));
};
