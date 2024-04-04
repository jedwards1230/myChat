import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";

import { Message } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { useConfigStore } from "../stores/configStore";
import { emitFeedback } from "../useChat/helpers";

export type PostChatMutationRequest = {
	threadId: string;
	signal: AbortSignal;
};

export type PostChatRequest = PostChatMutationRequest & {
	userId: string;
	stream?: boolean;
};

type FetcherResult<T> = T extends true ? Message : Response;
type QueryOpts = ReturnType<typeof messagesQueryOptions>;

async function postChatRequest({
	threadId,
	userId,
	stream,
	signal,
}: PostChatRequest): Promise<FetcherResult<typeof stream>> {
	const res = await fetcher<FetcherResult<typeof stream>>(
		[`/threads/${threadId}/runs`, userId],
		{
			method: "POST",
			...(Platform.OS !== "web" && { reactNative: { textStreaming: true } }),
			body: JSON.stringify({ stream, type: "getChat" }),
			signal,
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

	const finalMessage = async (opts: QueryOpts) => {
		// TODO: This is a hack to ensure the message is persisted to database before refetching
		// This should probably poll the server until the message is persisted
		await new Promise((resolve) => setTimeout(resolve, 1000));
		queryClient.refetchQueries(opts);
	};

	return useMutation({
		mutationKey: ["postChatRequest"],
		mutationFn: (props: PostChatMutationRequest) =>
			postChatRequest({ ...props, userId: user.id, stream }),
		onMutate: ({ threadId }) =>
			queryClient.cancelQueries(messagesQueryOptions(user.id, threadId)),
		onError: (error) => console.error(error),
		onSuccess: async (res, { threadId }) => {
			const opts = messagesQueryOptions(user.id, threadId);
			if (res instanceof Response) {
				if (!res.body) throw new Error("No stream found");
				const streamRunner = ChatCompletionStreamingRunner.fromReadableStream(
					res.body
				);
				console.log("Stream runner", { streamRunner });

				const streamHandler = new Promise<void>((resolve, reject) => {
					console.log("Declare stream handler");
					streamRunner
						.on("error", (error) => reject(error))
						.on("abort", () => null)
						.on("chunk", (chunk) => {
							const delta = chunk.choices[0].delta as Message;
							if (delta.role) addMessage(delta, opts);
							emitFeedback();
						})
						.on("content", async (chunk, content) =>
							updateMessage(content, opts)
						)
						.on("finalMessage", () => resolve());
				});

				await streamHandler;
			} else {
				addMessage(res, opts);
				emitFeedback();
			}

			finalMessage(opts);
		},
	});
};
