import { queryOptions, useQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

export const agentsQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["agents"],
		queryFn: () => fetcher<Agent[]>("/agents", { apiKey }),
	});
};

export const useAgentsQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(agentsQueryOptions(apiKey));
};
