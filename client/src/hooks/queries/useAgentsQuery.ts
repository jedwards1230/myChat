import { queryOptions, useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import type { Agent } from "@/types";
import { fetcher } from "@/lib/fetcher";

export const agentsQueryOptions = (userId: string) => {
	return queryOptions({
		queryKey: [userId, "agents"],
		queryFn: () => fetcher<Agent[]>("/agents", { userId }),
	});
};

export const useAgentsQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery(agentsQueryOptions(user.id));
};
