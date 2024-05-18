import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { AgentTool, ToolName } from "@/types";
import { fetcher } from "@/lib/fetcher";

/** Fetch agent by ID */
export const agentToolQueryOptions = (
	apiKey: string,
	agentId: string,
	toolId: string
) => {
	return queryOptions({
		queryKey: ["agentTool", agentId, toolId, apiKey],
		enabled: !!agentId && !!toolId,
		queryFn: () =>
			fetcher<AgentTool>(`/agents/${agentId}/tool/${toolId}`, { apiKey }),
	});
};

/** Fetch list of available models */
export const toolQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["tools", apiKey],
		queryFn: () => fetcher<ToolName[]>(`/agents/tools`, { apiKey }),
	});
};

export const useAgentToolQuery = (agentId: string, toolId: string) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(agentToolQueryOptions(apiKey, agentId, toolId));
};

export const useToolsQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(toolQueryOptions(apiKey));
};

export const useToolsSuspenseQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useSuspenseQuery(toolQueryOptions(apiKey));
};
