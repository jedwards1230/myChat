import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchFile =
	(userId: string, threadId: string, messageId: string, fileId: string) => () =>
		fetcher<MessageFile>([
			`/threads/${threadId}/messages/${messageId}/files/${fileId}`,
			userId,
		]);

export const fileQueryOptions = (
	userId: string,
	threadId: string,
	messageId: string,
	fileId: string
) => {
	return queryOptions({
		queryKey: [userId, threadId, messageId, fileId],
		enabled: !!threadId && !!messageId && !!fileId,
		queryFn: fetchFile(userId, threadId, messageId, fileId!),
	});
};

export const useFileQuery = (threadId: string, messageId: string, fileId: string) => {
	const user = useConfigStore((s) => s.user);
	return useQuery(fileQueryOptions(user.id, threadId, messageId, fileId));
};

export const useFileSuspenseQuery = (
	threadId: string,
	messageId: string,
	fileId: string
) => {
	const user = useConfigStore((s) => s.user);
	return useSuspenseQuery(fileQueryOptions(user.id, threadId, messageId, fileId));
};