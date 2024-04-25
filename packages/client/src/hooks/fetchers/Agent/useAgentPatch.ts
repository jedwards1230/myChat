import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { agentQueryOptions } from "./useAgentQuery";
import { Agent, AgentUpdateSchema } from "@/types";
import { agentsQueryOptions } from "./useAgentsQuery";

export type PatchAgentOptions = {
    agentId: string;
    agentConfig: AgentUpdateSchema;
};

const fetch = async ({ agentId, agentConfig }: PatchAgentOptions, apiKey: string) =>
    fetcher<Agent>(`/agents/${agentId}`, {
        apiKey,
        method: "PATCH",
        body: JSON.stringify(agentConfig),
    });

/** Patch an Agent object */
export const useAgentPatch = () => {
    const apiKey = useUserData((s) => s.apiKey);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["patchAgent"],
        mutationFn: async (opts: PatchAgentOptions) => fetch(opts, apiKey),
        onMutate: async ({ agentId, agentConfig }: PatchAgentOptions) => {
            const agentQuery = agentQueryOptions(apiKey, agentId);
            const agentsQuery = agentsQueryOptions(apiKey);
            const prevAgent = queryClient.getQueryData(agentQuery.queryKey);
            if (!prevAgent) return console.error("No cached agent found");
            await Promise.all([
                queryClient.cancelQueries(agentQuery),
                queryClient.cancelQueries(agentsQuery),
            ]);

            const agent = { ...prevAgent, ...{ [agentConfig.type]: agentConfig.value } };
            queryClient.setQueryData(agentQuery.queryKey, agent);

            return { agent };
        },
        onError: (error, { agentId }, context) => {
            if (agentId && context?.agent)
                queryClient.setQueryData(
                    agentQueryOptions(apiKey, agentId).queryKey,
                    context?.agent
                );
            console.error(error);
        },
        onSettled: async (res, err, { agentId }) => {
            await Promise.all([
                queryClient.invalidateQueries(agentQueryOptions(apiKey, agentId)),
                queryClient.invalidateQueries(agentsQueryOptions(apiKey)),
            ]);
        },
    });
};
