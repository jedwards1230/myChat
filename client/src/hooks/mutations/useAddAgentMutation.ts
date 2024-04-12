import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";
import { AgentCreateSchema } from "@/types";
import { agentsQueryOptions } from "../queries/useAgentsQuery";

const fetchAgent = (userId: string, agent: AgentCreateSchema) =>
	fetcher<AgentCreateSchema>("/agents", {
		method: "POST",
		body: JSON.stringify(agent),
		userId,
	});

export const useAddAgentMutation = () => {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["agent"],
		mutationFn: async (agent: AgentCreateSchema) => fetchAgent(user.id, agent),
		onMutate: async (agent: AgentCreateSchema) => {
			const queryOpts = agentsQueryOptions(user.id);
			const prevAgents = queryClient.getQueryData<AgentCreateSchema[]>(
				queryOpts.queryKey
			);

			queryClient.setQueryData<AgentCreateSchema[]>(
				queryOpts.queryKey,
				prevAgents ? [...prevAgents, agent] : [agent]
			);

			return { prevAgents };
		},
		onSuccess: () => queryClient.invalidateQueries(agentsQueryOptions(user.id)),
		onError: (error) => console.error("Failed to create agent: " + error),
	});
};
