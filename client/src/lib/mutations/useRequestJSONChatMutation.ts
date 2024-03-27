import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Message } from "@/types";
import { fetcher } from "../utils";
import { useConfigStore } from "../stores/configStore";

const postChatRequest = async (
	threadId: string | null,
	userId: string,
	stream: boolean = false
) =>
	fetcher<Message>(
		[`/chat`, userId],
		{
			method: "POST",
			body: JSON.stringify({
				threadId,
				stream,
			}),
		},
		stream
	);

export type PostChatRequest = {
	threadId: string | null;
	userId: string;
};

/**
 * Post a chat request to the server.
 * This will return a JSON response.
 * Use WebSocket for real-time chat.
 * */
export const iseRequestJSONChatMutation = () => {
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
