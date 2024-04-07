import { queryOptions, useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchAgents = (userId: string) => () => fetcher<Agent[]>(["/agents", userId]);

export const agentsQueryOptions = (userId: string) => {
	return queryOptions({
		queryKey: [userId, "agents"],
		queryFn: fetchAgents(userId),
	});
};

export const useAgentsQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery(agentsQueryOptions(user.id));
};
