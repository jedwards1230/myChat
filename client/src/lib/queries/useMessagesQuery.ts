import { useQuery } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import { Message } from "@/types";

const fetchMessages = (threadId: string | null, userId: string) => () =>
	fetcher<Message[]>([`/threads/${threadId}/messages`, userId]);

export const useMessagesQuery = (threadId: string | null) => {
	const user = useConfigStore((s) => s.user);
	const queryKey = [user.id, threadId];

	return useQuery({
		queryKey,
		enabled: !!threadId,
		queryFn: fetchMessages(threadId, user.id),
		retry: false,
	});
};
