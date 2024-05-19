import type { Agent } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const agentsQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["agents", apiKey],
		queryFn: () => fetcher<Agent[]>("/agents", { apiKey }),
	});
};

export const useAgentsQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(agentsQueryOptions(apiKey));
};
