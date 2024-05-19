import type { Thread } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const threadListQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["threadList", apiKey],
		queryFn: () => fetcher<Thread[]>("/threads", { apiKey }),
	});
};

export const useThreadListQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(threadListQueryOptions(apiKey));
};
