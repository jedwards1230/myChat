import { useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import type { Agent } from "@/types";
import { fetcher } from "../utils";

const fetchAgent = (userId: string, agentId: string) => () =>
	fetcher<Agent>([`/agents/${agentId}`, userId]);

export const useAgentQuery = (agentId?: string | null) => {
	const user = useConfigStore((s) => s.user);
	const queryKey = [user.id, "agents", agentId];

	return useQuery({
		queryKey,
		enabled: !!agentId,
		queryFn: fetchAgent(user.id, agentId!),
	});
};
