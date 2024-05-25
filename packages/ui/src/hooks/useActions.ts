import { api } from "@mychat/api/client/react-query";

import { useConfigStore } from "~/uiStore";
import { Icon } from "../native/Icon";

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
			Icon: Icon,
			type: "FontAwesome" as const,
			iconName: "trash" as const,
			onClick: threadId ? () => deleteThread(threadId) : undefined,
			hidden: !threadId,
		},
		{
			label: "Delete All Threads",
			Icon: Icon,
			type: "FontAwesome" as const,
			iconName: "trash" as const,
			onClick: deleteAllThreads,
		},
		{
			label: "Reset DB",
			Icon: Icon,
			type: "FontAwesome" as const,
			iconName: "database" as const,
			onClick: resetDb.action,
		},
	];

	return { items };
}
