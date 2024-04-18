import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { agentQueryOptions } from "./useAgentQuery";
import { Agent, Message } from "@/types";

export type PatchAgentOptions = {
	agentId: string;
	agentConfig: Partial<Agent>;
};

const fetch = async ({ agentId, agentConfig }: PatchAgentOptions, apiKey: string) =>
	fetcher<Message>(`/agents/${agentId}`, {
		apiKey,
		method: "PATCH",
		body: JSON.stringify({ agentConfig }),
	});

/** Post a message to the server */
export const useMessageEditMutation = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["patchAgent"],
		mutationFn: async (opts: PatchAgentOptions) => fetch(opts, apiKey),
		onMutate: async ({ agentId, agentConfig }: PatchAgentOptions) => {
			const agentQuery = agentQueryOptions(apiKey, agentId);
			const prevAgent = queryClient.getQueryData(agentQuery.queryKey);
			if (!prevAgent) return console.error("No cached agent found");
			queryClient.cancelQueries(agentQuery);

			const agent = { ...prevAgent, ...agentConfig };
			queryClient.setQueryData(agentQuery.queryKey, agent);

			return { agent };
		},
		onError: (error, { agentId, agentConfig }, context) => {
			if (agentId && context?.agent)
				queryClient.setQueryData(
					agentQueryOptions(apiKey, agentId).queryKey,
					context?.agent
				);
			console.error(error);
		},
		onSettled: (res, err, { agentId, agentConfig }) => {
			queryClient.invalidateQueries(agentQueryOptions(apiKey, agentId));
		},
	});
};
