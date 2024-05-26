import { api } from "@mychat/api/client/react-query";

import { Database, Trash } from "../svg";
import { useConfigStore } from "../uiStore";

export function useActions() {
	const { threadId } = useConfigStore();
	const { mutateAsync: deleteThread } = api.thread.delete.useMutation();

	const { mutateAsync: deleteAllThreads } = api.thread.deleteAll.useMutation();

	function useResetDb() {
		//const apiKey = useUserData((s) => s.apiKey);

		const action = async () => {
			const { mutateAsync } = api.admin.resetDb.useMutation();
			await mutateAsync();
			api.useUtils().invalidate();
		};

		return { action };
	}

	const resetDb = useResetDb();

	const items = [
		{
			label: "Delete Active Thread",
			Icon: Trash,
			onClick: threadId ? () => deleteThread(threadId) : undefined,
			hidden: !threadId,
		},
		{
			label: "Delete All Threads",
			Icon: Trash,
			onClick: deleteAllThreads,
		},
		{
			label: "Reset DB",
			Icon: Database,
			onClick: resetDb.action,
		},
	];

	return { items };
}
