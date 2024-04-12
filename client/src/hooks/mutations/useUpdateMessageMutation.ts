import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import type {
	MessageUpdateSchema,
	MessageObjectSchema as Message,
} from "@db/Message/MessageSchema";
import { messagesQueryOptions } from "../queries/useMessagesQuery";

export type UpdateMessageOptions = {
	threadId: string;
	message: MessageUpdateSchema;
};

const postMessage = async (
	{ threadId, message }: UpdateMessageOptions,
	apiKey: string
): Promise<Message> =>
	fetcher<Message>(`/threads/${threadId}/messages/${message.id}`, {
		apiKey,
		method: "POST",
		body: JSON.stringify({ message }),
	});

/** Update a message on the server */
export const useUpdateMessageMutation = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateMessage"],
		mutationFn: async (opts: UpdateMessageOptions) => postMessage(opts, apiKey),
		onMutate: async ({ threadId, message }: UpdateMessageOptions) => {
			if (!threadId) return { message };
			const prevMessages = queryClient.getQueryData<Message[]>([apiKey, threadId]);

			const mutatedMessages = prevMessages?.map((msg) =>
				msg.id === message.id ? { ...msg, ...message } : msg
			);

			queryClient.setQueryData([apiKey, threadId], mutatedMessages);

			return { prevMessages };
		},
		onError: (error, { threadId }, context) => {
			if (threadId && context?.prevMessages)
				queryClient.setQueryData([apiKey, threadId], context?.prevMessages);
			console.error(error);
		},
		onSettled: (res, err, opts) =>
			queryClient.invalidateQueries(messagesQueryOptions(apiKey, opts.threadId)),
	});
};
