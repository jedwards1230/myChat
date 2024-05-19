import { fetcher } from "@/lib/fetcher";
import { useQueryClient } from "@tanstack/react-query";

import { useDeleteAllThreadsMutation } from "../fetchers/Thread/useDeleteAllThreadsMutation";
import { useDeleteThreadMutation } from "../fetchers/Thread/useDeleteThreadMutation";
import { useUserData } from "../stores/useUserData";

export function useDeleteActiveThread() {
	const { mutateAsync } = useDeleteThreadMutation();
	const action = async (threadId: string) => mutateAsync(threadId);
	return { action };
}

export function useDeleteAllThreads() {
	const { mutateAsync } = useDeleteAllThreadsMutation();
	const action = async () => mutateAsync();
	return { action };
}

/** Reset the Server DB to empty. */
export function useResetDb() {
	const queryClient = useQueryClient();
	const apiKey = useUserData((s) => s.apiKey);

	const action = async () => {
		await fetcher("/reset", { apiKey });
		queryClient.invalidateQueries();
	};

	return { action };
}
