import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
	MessageObjectSchema as Message,
	MessageCreateSchema,
} from "@mychat/shared/schemas/Message";

import { messagesQueryOptions } from "./useMessagesQuery";

export interface PostMessageOptions {
	threadId: string;
	message: MessageCreateSchema;
}

const postMessage = async ({ threadId, message }: PostMessageOptions, apiKey: string) =>
	fetcher<Message>(`/threads/${threadId}/messages`, {
		apiKey,
		method: "POST",
		body: JSON.stringify(message),
	});

/** Post a message to the server */
export const useMessagePost = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessage"],
		mutationFn: async (opts: PostMessageOptions) => postMessage(opts, apiKey),
		onMutate: async ({ threadId, message }: PostMessageOptions) => {
			const messagesQuery = messagesQueryOptions(apiKey, threadId);
			const cached = queryClient.getQueryData(messagesQuery.queryKey);
			await queryClient.cancelQueries(messagesQuery);

			const prevMessages = cached ?? [];
			const msg = {
				content: message.content ?? "",
				role: message.role ?? "user",
			} as Message;
			const messages = prevMessages.length ? [...prevMessages, msg] : [msg];

			queryClient.setQueryData(messagesQuery.queryKey, messages as any[]);

			return { prevMessages, message };
		},
		onError: (error, { threadId }, context) => {
			if (threadId && context?.prevMessages)
				queryClient.setQueryData(
					messagesQueryOptions(apiKey, threadId).queryKey,
					context.prevMessages,
				);
			console.error(error);
		},
		onSettled: (res, err, { threadId }) => {
			return queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId));
		},
	});
};
