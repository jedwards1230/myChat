import { api } from "@mychat/api/client/react-query";

/** Patch an Agent object */
export const useAgentToolPatch = () => {
	const client = api.useUtils();

	return api.agentTool.edit.useMutation({
		onMutate: async ({ id, data: agentTool }) => {
			const prevAgentTool = client.agentTool.byId.getData({ id });
			if (!prevAgentTool) return console.error("No cached agent tool found");
			await Promise.all([
				client.agentTool.byId.cancel({ id }),
				client.agent.byId.cancel({ id: agentTool.ownerId ?? "" }),
				client.agent.all.cancel(),
			]);
			const newAgentTool = {
				...prevAgentTool,
				...agentTool,
			};
			client.agentTool.byId.setData({ id }, newAgentTool);

			return { newAgentTool, prevAgentTool };
		},
		onError: (_, { id }, context) =>
			client.agentTool.byId.setData({ id }, context?.prevAgentTool),
		onSettled: async () =>
			Promise.all([client.agentTool.invalidate(), client.agent.invalidate()]),
	});
};
