import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchFile = (userId: string, threadId: string, messageId: string) => () =>
	fetcher<MessageFile[]>([`/threads/${threadId}/messages/${messageId}/files`, userId]);

export const fileQueryOptions = (userId: string, threadId: string, messageId: string) => {
	return queryOptions({
		queryKey: [userId, threadId, messageId, "files"],
		enabled: !!threadId && !!messageId,
		queryFn: fetchFile(userId, threadId, messageId),
	});
};

export const useFilesQuery = (threadId: string, messageId: string) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(fileQueryOptions(user.id, threadId, messageId));
};

export const useFilesSuspenseQuery = (threadId: string, messageId: string) => {
	const user = useConfigStore((s) => s.user);
	return useSuspenseQuery(fileQueryOptions(user.id, threadId, messageId));
};
