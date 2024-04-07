import { useQueryClient } from "@tanstack/react-query";
import { useDeleteThreadMutation } from "../mutations/useDeleteThreadMutation";
import { fetcher } from "../fetcher";
import { useConfigStore } from "../stores/configStore";

const Actions = {
	deleteThread: useDeleteThread,
	resetDb: useResetDb,
};

export type Command = keyof typeof Actions;

export const ActionList: Command[] = Object.keys(Actions) as Command[];

export function useAction(commands: Command) {
	return Actions[commands]();
}

function useDeleteThread() {
	const deleteThreadMutation = useDeleteThreadMutation();

	const action = async (threadId: string) => {
		if (!deleteThreadMutation) return console.error("No thread or userId");
		deleteThreadMutation.mutate(threadId);
	};

	return { action };
}

function useResetDb() {
	const queryClient = useQueryClient();
	const user = useConfigStore((s) => s.user);

	const action = async () => {
		await fetcher(["/reset", user.id]);
		queryClient.invalidateQueries();
	};

	return { action };
}
