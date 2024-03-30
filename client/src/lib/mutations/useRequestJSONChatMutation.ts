import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Message } from "@/types";
import { useConfigStore } from "../stores/configStore";
import { fetcher } from "@/lib/fetcher";

const postChatRequest = async (
	threadId: string | null,
	userId: string,
	stream: boolean = false
) => {
	console.log("requesting chat", threadId, userId, stream);
	const res = await fetcher<Message>([`/threads/${threadId}/runs`, userId], {
		method: "POST",
		body: JSON.stringify({
			threadId,
			stream,
		}),
		stream,
	});

	console.log("chat requested", res);

	return res;
};

export type PostChatRequest = {
	threadId: string | null;
	userId: string;
};

/**
 * Post a chat request to the server.
 * This will return a JSON response.
 * Use WebSocket for real-time chat.
 * */
export const useRequestJSONChatMutation = () => {
	const user = useConfigStore((s) => s.user);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postChatRequest"],
		mutationFn: async (threadId: string | null) => postChatRequest(threadId, user.id),
		onError: (error) => console.error(error),
		onSettled: (res, err, threadId) =>
			queryClient.invalidateQueries({
				queryKey: [user.id, threadId],
			}),
	});
};
