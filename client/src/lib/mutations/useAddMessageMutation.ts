import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import type {
	MessageCreateSchema,
	MessageObjectSchema as Message,
} from "@db/Message/MessageSchema";
import { messagesQueryOptions } from "../queries/useMessagesQuery";

export type PostMessageOptions = {
	threadId: string;
	message: MessageCreateSchema;
};

const postMessage = async ({ threadId, message }: PostMessageOptions, userId: string) =>
	fetcher<Message>([`/threads/${threadId}/messages`, userId], {
		method: "POST",
		body: JSON.stringify({ message }),
	});

/** Post a message to the server */
export const useAddMessageMutation = () => {
	const { user } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessage"],
		mutationFn: async (opts: PostMessageOptions) => postMessage(opts, user.id),
		onMutate: async ({ threadId, message }: PostMessageOptions) => {
			if (!threadId) return { message };
			const messagesQuery = messagesQueryOptions(user.id, threadId);
			const cached = queryClient.getQueryData(messagesQuery.queryKey);

			const prevMessages = cached || [];
			const msg = {
				content: message.content || "",
				role: message.role || "user",
			} as Message;
			const messages = prevMessages ? [...prevMessages, msg] : [msg];

			queryClient.setQueryData(messagesQuery.queryKey, messages as any[]);

			return { prevMessages, message };
		},
		onError: (error, { threadId, message }, context) => {
			if (threadId && context?.prevMessages)
				queryClient.setQueryData(
					messagesQueryOptions(user.id, threadId).queryKey,
					context?.prevMessages
				);
			console.error(error);
		},
		onSettled: (res, err, opts) => {
			queryClient.invalidateQueries(messagesQueryOptions(user.id, opts.threadId));
		},
	});
};
