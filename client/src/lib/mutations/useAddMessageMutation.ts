import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "../utils";
import type {
	MessageCreateSchema,
	MessageObjectSchema as Message,
} from "@db/Message/MessageSchema";

export type PostMessageOptions = {
	threadId: string;
	message: MessageCreateSchema;
};

const postMessage = async (
	{ threadId, message: newMessage }: PostMessageOptions,
	userId: string
): Promise<Message> => {
	const message = await fetcher<Message>([`/threads/${threadId}/messages`, userId], {
		method: "POST",
		body: JSON.stringify({ message: newMessage }),
	});
	return message;
};

/** Post a message to the server */
export const useAddMessageMutation = () => {
	const { user } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessage"],
		mutationFn: async (opts: PostMessageOptions) => postMessage(opts, user.id),
		onMutate: async ({ threadId, message }: PostMessageOptions) => {
			if (!threadId) return { message };
			const prevMessages = queryClient.getQueryData<Message[]>([user.id, threadId]);

			queryClient.setQueryData<Message[]>(
				[user.id, threadId],
				prevMessages
					? [...prevMessages, message as Message]
					: [message as Message]
			);

			return { prevMessages, message };
		},
		onError: (error, { threadId, message }, context) => {
			if (threadId && context?.prevMessages)
				queryClient.setQueryData([user.id, threadId], context?.prevMessages);
			console.error(error);
		},
		onSettled: (res, err, opts, context) => {
			queryClient.invalidateQueries({
				queryKey: [user.id, opts.threadId],
			});
			queryClient.refetchQueries({
				queryKey: [user.id, "threads"],
			});
		},
	});
};
