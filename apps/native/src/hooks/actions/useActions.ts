import { Icon } from "@mychat/ui/native/Icon";

import { useConfigStore } from "../stores/configStore";
import { useDeleteActiveThread, useDeleteAllThreads, useResetDb } from "./actions";

export function useActions() {
	const { threadId } = useConfigStore();
	const deleteThread = useDeleteActiveThread();
	const deleteAllThreads = useDeleteAllThreads();
	const resetDb = useResetDb();

	const items = [
		{
			label: "Delete Active Thread",
			Icon: Icon,
			type: "FontAwesome" as const,
			iconName: "trash" as const,
			onClick: threadId ? () => deleteThread.action(threadId) : undefined,
			hidden: !threadId,
		},
		{
			label: "Delete All Threads",
			Icon: Icon,
			type: "FontAwesome" as const,
			iconName: "trash" as const,
			onClick: deleteAllThreads.action,
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
