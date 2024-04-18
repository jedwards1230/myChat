import { useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useUserData } from "../stores/useUserData";
import { useDeleteThreadMutation } from "../fetchers/Thread/useDeleteThreadMutation";

const Actions = {
	deleteThread: useDeleteThread,
	resetDb: useResetDb,
};

type ActionMap = typeof Actions;
export type Command = keyof ActionMap;
export type UIAction = ReturnType<ActionMap[keyof ActionMap]>;

export const ActionList: Command[] = Object.keys(Actions) as Command[];

export function useAction<K extends Command>(action: K): ActionMap[K] {
	return Actions[action];
}

function useDeleteThread() {
	const deleteThreadMutation = useDeleteThreadMutation();

	const action = async (threadId: string) => {
		if (!deleteThreadMutation) return console.error("No thread or userId");
		deleteThreadMutation.mutate(threadId);
	};

	return { action };
}

/** Reset the Server DB to empty. */
function useResetDb() {
	const queryClient = useQueryClient();
	const apiKey = useUserData((s) => s.apiKey);

	const action = async () => {
		await fetcher("/reset", { apiKey });
		queryClient.invalidateQueries();
	};

	return { action };
}
