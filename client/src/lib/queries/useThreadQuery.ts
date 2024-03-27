import { Thread } from "@/types";
import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";
import { useQuery } from "@tanstack/react-query";

const fetchThread = (userId: string, threadId: string) => () =>
	fetcher<Thread>([`/threads/${threadId}`, userId]);

export const useThreadQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	return useQuery({
		queryKey: [user.id, "threads", threadId],
		enabled: !!threadId,
		queryFn: fetchThread(user.id, threadId!),
	});
};
