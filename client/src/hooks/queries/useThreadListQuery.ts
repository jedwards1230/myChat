import { queryOptions, useQuery } from "@tanstack/react-query";

import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";

export const threadListQueryOptions = (userId: string) => {
	return queryOptions({
		queryKey: [userId, "threads"],
		queryFn: () => fetcher<Thread[]>("/threads", { userId }),
	});
};

export const useThreadListQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery(threadListQueryOptions(user.id));
};
