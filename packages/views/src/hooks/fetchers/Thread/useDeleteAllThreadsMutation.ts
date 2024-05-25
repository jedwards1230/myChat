import { api } from "@mychat/api/client/react-query";
import { useConfigStore } from "@mychat/ui/uiStore";

export function useDeleteAllThreadsMutation() {
	const setThreadId = useConfigStore.use.setThreadId();
	const client = api.useUtils();

	return api.message.delete.useMutation({
		onMutate: async () => {
			setThreadId(null);
			await client.thread.all.cancel();
			const cached = client.thread.all.getData() ?? [];

			client.thread.all.setData(undefined, []);
			return { cached };
		},
		onSuccess: async () => client.thread.all.invalidate(),
		onError: async (error, _, ctx) => {
			client.thread.all.setData(undefined, ctx?.cached);
		},
	});
}
