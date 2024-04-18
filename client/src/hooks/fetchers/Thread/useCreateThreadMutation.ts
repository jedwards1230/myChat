import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";
import { threadListQueryOptions } from "./useThreadListQuery";

const createThread = async (apiKey: string) =>
	fetcher<Thread>(`/threads`, {
		apiKey,
		method: "POST",
		headers: { "Content-Type": "text/plain" },
	});

/** Create a new Thread on the server */
export function useCreateThreadMutation() {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createThread"],
		mutationFn: async () => createThread(apiKey),
		onError: (error) => console.error(error),
		onSettled: () => queryClient.invalidateQueries(threadListQueryOptions(apiKey)),
	});
}
