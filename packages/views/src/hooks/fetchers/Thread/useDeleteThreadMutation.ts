import { useRouter } from "solito/navigation";

import { api } from "@mychat/api/client/react-query";
import { useConfigStore } from "@mychat/ui/uiStore";

export function useDeleteThreadMutation() {
	const { threadId: activeThreadId, setThreadId } = useConfigStore();

	const router = useRouter();
	const client = api.useUtils();

	return api.thread.delete.useMutation({
		onMutate: async (threadId) => {
			const sameThread = threadId === activeThreadId;
			if (sameThread) {
				setThreadId(null);
				router.push("/(app)");
				await client.message.all.cancel();
			}
			await client.thread.all.cancel();

			const cached = client.thread.all.getData();
			const threads = (cached ?? []).filter((t) => t.id !== threadId);

			client.thread.all.setData(undefined, threads);
			return { activeThreadId, sameThread };
		},
		onSuccess: async (_, threadId, ctx) => {
			if (ctx.sameThread) {
				setThreadId(null);
			} else {
				client.message.all.invalidate();
			}
			await client.thread.all.invalidate();
		},
		onError: async (error, threadId, ctx) => {
			console.error("Failed to delete thread: " + error.message);
			setThreadId(threadId || null);
			if (ctx?.sameThread) {
				//router.setParams({ c: threadId });
			}
			await client.thread.all.invalidate();
		},
	});
}
