import { queryOptions, useQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

export const agentQueryOptions = (apiKey: string, agentId: string) => {
	return queryOptions({
		queryKey: ["agents", agentId],
		enabled: !!agentId,
		queryFn: () => fetcher<Agent>(`/agents/${agentId}`, { apiKey }),
	});
};

export const toolQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["tools"],
		queryFn: () => fetcher<string[]>(`/agents/tools`, { apiKey }),
	});
};

export const useAgentQuery = (agentId: string) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(agentQueryOptions(apiKey, agentId));
};

export const useToolsQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(toolQueryOptions(apiKey));
};
