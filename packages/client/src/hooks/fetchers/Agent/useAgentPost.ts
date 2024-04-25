import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { AgentCreateSchema } from "@/types";
import { agentsQueryOptions } from "./useAgentsQuery";
import { useUserData } from "../../stores/useUserData";

const fetchAgent = (apiKey: string, agent: AgentCreateSchema) =>
    fetcher<AgentCreateSchema>("/agents", {
        method: "POST",
        body: JSON.stringify(agent),
        apiKey,
    });

export const useAgentPost = () => {
    const apiKey = useUserData((s) => s.apiKey);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["agent"],
        mutationFn: async (agent: AgentCreateSchema) => fetchAgent(apiKey, agent),
        onMutate: async (agent: AgentCreateSchema) => {
            const queryOpts = agentsQueryOptions(apiKey);
            const prevAgents = queryClient.getQueryData<AgentCreateSchema[]>(
                queryOpts.queryKey
            );

            queryClient.setQueryData<AgentCreateSchema[]>(
                queryOpts.queryKey,
                prevAgents ? [...prevAgents, agent] : [agent]
            );

            return { prevAgents };
        },
        onSuccess: () => queryClient.invalidateQueries(agentsQueryOptions(apiKey)),
        onError: (error) => console.error("Failed to create agent: " + error),
    });
};
