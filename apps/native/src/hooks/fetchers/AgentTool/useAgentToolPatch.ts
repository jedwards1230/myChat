import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import type { AgentTool, AgentToolUpdateSchema } from "@/types";
import { agentToolQueryOptions } from "./useAgentToolQuery";
import { agentsQueryOptions } from "../Agent/useAgentsQuery";
import { agentQueryOptions } from "../Agent/useAgentQuery";

export type PatchAgentToolOptions = {
	agentId: string;
	toolId: string;
	agentToolConfig: AgentToolUpdateSchema;
};

const fetch = async (
	{ agentId, toolId, agentToolConfig }: PatchAgentToolOptions,
	apiKey: string
) =>
	fetcher<AgentTool>(`/agents/${agentId}/tool/${toolId}`, {
		apiKey,
		method: "PATCH",
		body: JSON.stringify(agentToolConfig),
	});

/** Patch an Agent object */
export const useAgentToolPatch = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["patchAgentTool"],
		mutationFn: async (opts: PatchAgentToolOptions) => fetch(opts, apiKey),
		onMutate: async ({ agentId, toolId, agentToolConfig }: PatchAgentToolOptions) => {
			if (!agentToolConfig.type || !agentToolConfig.value)
				return console.error("Invalid config");
			const agentQuery = agentQueryOptions(apiKey, agentId);
			const agentsQuery = agentsQueryOptions(apiKey);
			const agentToolQuery = agentToolQueryOptions(apiKey, agentId, toolId);

			const prevAgentTool = queryClient.getQueryData(agentToolQuery.queryKey);
			if (!prevAgentTool) return console.error("No cached agent tool found");
			await Promise.all([
				queryClient.cancelQueries(agentQuery),
				queryClient.cancelQueries(agentsQuery),
				queryClient.cancelQueries(agentToolQuery),
			]);
			const agentTool = {
				...prevAgentTool,
				...{ [agentToolConfig.type]: agentToolConfig.value },
			};
			queryClient.setQueryData(agentToolQuery.queryKey, agentTool);

			return { agentTool };
		},
		onError: (error, { agentId, toolId }, context) => {
			if (agentId && context?.agentTool)
				queryClient.setQueryData(
					agentToolQueryOptions(apiKey, agentId, toolId).queryKey,
					context?.agentTool
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
