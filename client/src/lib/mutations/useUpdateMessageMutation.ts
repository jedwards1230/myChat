import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import type {
	MessageUpdateSchema,
	MessageObjectSchema as Message,
} from "@db/Message/MessageSchema";

export type UpdateMessageOptions = {
	threadId: string;
	message: MessageUpdateSchema;
};

const postMessage = async (
	{ threadId, message }: UpdateMessageOptions,
	userId: string
): Promise<Message> => {
	const res = await fetcher<Message>(
		[`/threads/${threadId}/messages/${message.id}`, userId],
		{
			method: "POST",
			body: JSON.stringify({ message }),
		}
	);
	return res;
};

/** Update a message on the server */
export const useUpdateMessageMutation = () => {
	const { user } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateMessage"],
		mutationFn: async (opts: UpdateMessageOptions) => postMessage(opts, user.id),
		onMutate: async ({ threadId, message }: UpdateMessageOptions) => {
			if (!threadId) return { message };
			const prevMessages = queryClient.getQueryData<Message[]>([user.id, threadId]);

			const mutatedMessages = prevMessages?.map((msg) =>
				msg.id === message.id ? { ...msg, ...message } : msg
			);

			queryClient.setQueryData([user.id, threadId], mutatedMessages);

			return { prevMessages };
		},
		onError: (error, { threadId }, context) => {
			if (threadId && context?.prevMessages)
				queryClient.setQueryData([user.id, threadId], context?.prevMessages);
			console.error(error);
		},
		onSettled: (res, err, opts) => {
			queryClient.invalidateQueries({
				queryKey: [user.id, opts.threadId],
			});
		},
	});
};
