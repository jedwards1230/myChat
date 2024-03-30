import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import type { Thread } from "@/types";

const createThread = async (userId: string): Promise<Thread> => {
	const data = await fetcher<Thread>([`/threads`, userId], {
		method: "POST",
		headers: { "Content-Type": "text/plain" },
	});
	return data;
};

/** Create a new Thread on the server */
export function useCreateThreadMutation() {
	const { user, setThreadId } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createThread"],
		mutationFn: async () => createThread(user.id),
		onError: (error) => console.error(error),
		onSuccess: (res) => {
			setThreadId(res.id);
			router.push({
				pathname: "/(chat)/",
				params: { c: res.id },
			});
		},
		onSettled: () =>
			queryClient.refetchQueries({
				queryKey: [user.id, "threads"],
			}),
	});
}
