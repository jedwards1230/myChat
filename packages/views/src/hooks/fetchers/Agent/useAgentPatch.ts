import { api } from "@mychat/api/client/react-query";

/** Patch an Agent object */
export const useAgentPatch = () => {
	const client = api.useUtils();

	return api.agent.edit.useMutation({
		onMutate: async ({ id, data }) => {
			const prevAgent = client.agent.byId.getData({ id });
			if (!prevAgent) return console.error("No cached agent found");
			await Promise.all([
				client.agent.byId.cancel({ id }),
				client.agent.all.cancel(),
			]);

			const agent = { ...prevAgent, ...data };
			client.agent.byId.setData({ id }, agent);

			return { agent };
		},
		onError: (error, { id }, context) => {
			if (id && context?.agent) client.agent.byId.setData({ id }, context.agent);
			console.error(error);
		},
		onSettled: async () => client.agent.invalidate(),
	});
};
