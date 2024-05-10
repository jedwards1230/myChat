import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fetchFile =
	(apiKey: string, threadId: string, messageId: string, fileId: string) => () =>
		fetcher<MessageFile>(
			`/threads/${threadId}/messages/${messageId}/files/${fileId}`,
			{ apiKey }
		);

export const fileQueryOptions = (
	userId: string,
	threadId: string,
	messageId: string,
	fileId: string
) => {
	return queryOptions({
		queryKey: [userId, threadId, messageId, "files", fileId],
		enabled: !!threadId && !!messageId && !!fileId,
		queryFn: fetchFile(userId, threadId, messageId, fileId!),
	});
};

/* export const useFileQuery = (threadId: string, messageId: string, fileId: string) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(fileQueryOptions(apiKey, threadId, messageId, fileId));
}; */

export const useFileSuspenseQuery = (
	threadId: string,
	messageId: string,
	fileId: string
) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useSuspenseQuery(fileQueryOptions(apiKey, threadId, messageId, fileId));
};
