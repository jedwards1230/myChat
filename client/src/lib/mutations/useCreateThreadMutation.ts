import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/lib/stores/configStore";
import { threadListQueryOptions } from "../queries/useThreadListQuery";

const createThread = async (userId: string) =>
	fetcher<Thread>([`/threads`, userId], {
		method: "POST",
		headers: { "Content-Type": "text/plain" },
	});

/** Create a new Thread on the server */
export function useCreateThreadMutation() {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createThread"],
		mutationFn: async () => createThread(user.id),
		onError: (error) => console.error(error),
		onSettled: () => queryClient.invalidateQueries(threadListQueryOptions(user.id)),
	});
}
