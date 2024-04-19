import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { messagesQueryOptions } from "./useMessagesQuery";
import { Message } from "@/types";

export type PostMessageOptions = {
    threadId: string;
    messageId: string;
    content: string;
};

const postMessage = async (
    { threadId, messageId, content }: PostMessageOptions,
    apiKey: string
) =>
    fetcher<Message>(`/threads/${threadId}/messages/${messageId}`, {
        apiKey,
        method: "PATCH",
        body: JSON.stringify({ content }),
    });

/** Post a message to the server */
export const useMessagePatch = () => {
    const apiKey = useUserData((s) => s.apiKey);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["patchMessage"],
        mutationFn: async (opts: PostMessageOptions) => postMessage(opts, apiKey),
        onMutate: async ({ threadId, messageId, content }: PostMessageOptions) => {
            const messagesQuery = messagesQueryOptions(apiKey, threadId);
            const prevMessages = queryClient.getQueryData(messagesQuery.queryKey);
            if (!prevMessages) return console.error("No cached messages found");
            queryClient.cancelQueries(messagesQuery);

            const messages = prevMessages.map((msg) =>
                msg.id === messageId
                    ? {
                          ...msg,
                          content,
                      }
                    : msg
            );
            queryClient.setQueryData(messagesQuery.queryKey, messages);

            return { prevMessages, content };
        },
        onError: (error, { threadId }, context) => {
            if (threadId && context?.prevMessages)
                queryClient.setQueryData(
                    messagesQueryOptions(apiKey, threadId).queryKey,
                    context?.prevMessages
                );
            console.error(error);
        },
        onSettled: (res, err, { threadId }) => {
            queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId));
        },
    });
};
