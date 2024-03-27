import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";
import { AgentCreateSchema } from "@/types";

const fetchAgent = (userId: string, agent: AgentCreateSchema) =>
	fetcher<AgentCreateSchema>(["/agents", userId], {
		method: "POST",
		body: JSON.stringify(agent),
	});

export const useAddAgentMutation = () => {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["agent"],
		mutationFn: async (agent: AgentCreateSchema) => fetchAgent(user.id, agent),
		onMutate: async (agent: AgentCreateSchema) => {
			const prevAgents = queryClient.getQueryData<AgentCreateSchema[]>([
				user.id,
				"agents",
			]);

			queryClient.setQueryData<AgentCreateSchema[]>(
				[user.id, "agents"],
				prevAgents ? [...prevAgents, agent] : [agent]
			);

			return { prevAgents };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [user.id, "agents"] });
		},
		onError: (error) => console.error("Failed to create agent: " + error),
	});
};
