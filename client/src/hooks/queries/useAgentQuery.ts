import { queryOptions, useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchAgent = (userId: string, agentId: string) => () =>
	fetcher<Agent>([`/agents/${agentId}`, userId]);

export const agentQueryOptions = (userId: string, agentId: string) => {
	return queryOptions({
		queryKey: [userId, "agents", agentId],
		enabled: !!agentId,
		queryFn: fetchAgent(userId, agentId),
	});
};

export const useAgentQuery = (agentId: string) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(agentQueryOptions(user.id, agentId));
};
