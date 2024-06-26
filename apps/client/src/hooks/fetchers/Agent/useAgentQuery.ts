import { queryOptions, useQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

/** Fetch agent by ID */
export const agentQueryOptions = (apiKey: string, agentId: string) => {
    return queryOptions({
        queryKey: ["agents", agentId, apiKey],
        enabled: !!agentId,
        queryFn: () => fetcher<Agent>(`/agents/${agentId}`, { apiKey }),
    });
};

export const useAgentQuery = (agentId: string) => {
    const apiKey = useUserData((s) => s.apiKey);
    return useQuery(agentQueryOptions(apiKey, agentId));
};
