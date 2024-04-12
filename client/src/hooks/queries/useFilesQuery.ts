import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import type { MessageFile } from "@/types";
import { fetcher } from "@/lib/fetcher";

const fileQueryOptions = (apiKey: string, threadId: string, messageId: string) =>
	queryOptions({
		queryKey: [threadId, messageId, "files"],
		enabled: !!threadId && !!messageId,
		queryFn: () =>
			fetcher<MessageFile[]>(`/threads/${threadId}/messages/${messageId}/files`, {
				apiKey,
			}),
	});

export const useFilesSuspenseQuery = (threadId: string, messageId: string) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useSuspenseQuery(fileQueryOptions(apiKey, threadId, messageId));
};
