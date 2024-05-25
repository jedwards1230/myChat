import { api } from "@mychat/api/client/react-query";

export const useAgentPost = () => {
	const client = api.useUtils();

	return api.agent.create.useMutation({
		onMutate: async (agent) => {
			const prevAgents = client.agent.all.getData() ?? [];

			const newAgents = [
				...prevAgents,
				{
					...agent,
					id: String(prevAgents.length),
					createdAt: new Date().toISOString(),
				},
			] as typeof prevAgents;

			client.agent.all.setData(undefined, newAgents);

			return { prevAgents };
		},
		onSuccess: () => client.agent.all.invalidate(),
		onError: (error) => console.error("Failed to create agent: " + error.message),
	});
};
