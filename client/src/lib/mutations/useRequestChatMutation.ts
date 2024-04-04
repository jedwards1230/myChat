import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

import { Message } from "@/types";
import { useConfigStore } from "../stores/configStore";
import { fetcher } from "@/lib/fetcher";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { handleStreamResponse } from "../useChat/chat.stream";

export type PostChatRequest = {
	threadId: string | null;
	userId: string;
};

type FetcherResult<T> = T extends true ? Message : Response;

type QueryOpts = ReturnType<typeof messagesQueryOptions>;

async function postChatRequest(
	threadId: string,
	userId: string,
	stream?: boolean
): Promise<FetcherResult<typeof stream>> {
	const res = await fetcher<FetcherResult<typeof stream>>(
		[`/threads/${threadId}/runs`, userId],
		{
			method: "POST",
			...(Platform.OS !== "web" && { reactNative: { textStreaming: true } }),
			body: JSON.stringify({ stream, type: "getChat" }),
			stream,
		}
	);

	if (stream && res instanceof Response && res.body === null)
		throw new Error("No stream found");

	return res;
}

export const useRequestChatMutation = () => {
	const { user, stream } = useConfigStore();
	const queryClient = useQueryClient();

	const addMessage = (message: Message, opts: QueryOpts) =>
		queryClient.setQueryData(opts.queryKey, (messages) =>
			messages ? [...messages, message] : [message]
		);

	const updateMessage = (content: string, opts: QueryOpts) =>
		queryClient.setQueryData(opts.queryKey, (messages) => {
			if (!messages) throw new Error("No messages found");

			const lastMessage = messages[messages.length - 1];
			const updatedMessage = { ...lastMessage, content };
			const newMessages = [...messages.slice(0, -1), updatedMessage];

			return newMessages;
		});

	const finalMessage = (opts: QueryOpts) => {
		queryClient.refetchQueries(opts);
	};

	return useMutation({
		mutationKey: ["postChatRequest"],
		mutationFn: (threadId: string) => postChatRequest(threadId, user.id, stream),
		onMutate: (threadId) =>
			queryClient.cancelQueries(messagesQueryOptions(user.id, threadId)),
		onError: (error) => console.error(error),
		onSuccess: (res, threadId) => {
			const opts = messagesQueryOptions(user.id, threadId);
			if (res instanceof Response) {
				if (!res.body) throw new Error("No stream found");
				handleStreamResponse(res.body, {
					addMessage: (msg) => addMessage(msg, opts),
					updateMessage: (content) => updateMessage(content, opts),
					finalMessage: () => finalMessage(opts),
				});
			} else {
				addMessage(res, opts);
				finalMessage(opts);
			}
		},
	});
};
