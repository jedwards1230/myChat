import { queryOptions, useQuery } from "@tanstack/react-query";

import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";

const fetchThreadList = (userId: string, init?: FetchRequestInit) => () =>
	fetcher<Thread[]>(["/threads", userId], init);

export const threadListQueryOptions = (userId: string) => {
	return queryOptions({
		queryKey: [userId, "threads"],
		queryFn: fetchThreadList(userId),
	});
};

export const useThreadListQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery(threadListQueryOptions(user.id));
};
