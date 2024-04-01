import { useSuspenseQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchFile =
	(userId: string, threadId: string, messageId: string, fileId: string) => () =>
		fetcher<MessageFile>([
			`/threads/${threadId}/messages/${messageId}/files/${fileId}`,
			userId,
		]);

export const useFileQuery = (messageId: string, fileId: string) => {
	const { user, threadId } = useConfigStore();
	if (!threadId) throw new Error("Thread ID is required");
	const queryKey = [user.id, threadId, fileId];

	return useSuspenseQuery({
		queryKey,
		queryFn: fetchFile(user.id, threadId, messageId, fileId!),
	});
};
