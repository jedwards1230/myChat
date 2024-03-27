import { useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import type { Agent } from "@/types";
import { fetcher } from "../utils";

const fetchAgents = (userId: string) => () => fetcher<Agent[]>(["/agents", userId]);

export const useAgentsQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery({
		queryKey: [user.id, "agents"],
		queryFn: fetchAgents(user.id),
	});
};
