import { useConfigStore } from "@/hooks/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "../../stores/useUserData";
import { threadListQueryOptions } from "./useThreadListQuery";

const deleteThread = (apiKey: string) =>
	fetcher(`/threads/`, {
		apiKey,
		method: "DELETE",
		stream: true,
	});

export function useDeleteAllThreadsMutation() {
	const apiKey = useUserData.use.apiKey();
	const setThreadId = useConfigStore.use.setThreadId();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteAllThreads"],
		mutationFn: () => deleteThread(apiKey),
		onMutate: async () => {
			const listQuery = threadListQueryOptions(apiKey);
			setThreadId(null);
			await queryClient.cancelQueries();
			const cached = queryClient.getQueryData(listQuery.queryKey);

			queryClient.setQueryData(listQuery.queryKey, []);
			return { cached };
		},
		onSuccess: async () => queryClient.invalidateQueries(),
		onError: async (error, _, ctx) => {
			console.error("Failed to delete threads: " + error.message);
			queryClient.setQueryData(
				threadListQueryOptions(apiKey).queryKey,
				ctx?.cached,
			);
			await queryClient.invalidateQueries();
		},
	});
}
