import { queryOptions, useQuery } from "@tanstack/react-query";

import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";

export const threadListQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["threads"],
		queryFn: () => fetcher<Thread[]>("/threads", { apiKey }),
	});
};

export const useThreadListQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(threadListQueryOptions(apiKey));
};
