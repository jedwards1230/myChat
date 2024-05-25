import { emitFeedback } from "@/lib/FeedbackEmitter";
import { getStreamProcessor } from "@/lib/StreamProcessor";

import type { Message } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";

export const useRequestChatMutation = (fn: () => void) => {
	const client = api.useUtils();

	const addMessage = (message: Message) =>
		client.message.all.setData(
			undefined,
			(messages) =>
				(messages ? [...messages, message] : [message]) as typeof messages,
		);

	const updateMessage = (content: string) =>
		client.message.all.setData(undefined, (messages) => {
			if (!messages) throw new Error("No messages found");

			const lastMessage = messages[messages.length - 1];
			if (!lastMessage) throw new Error("No last message found");
			const updatedMessage = { ...lastMessage, content };
			const newMessages = [...messages.slice(0, -1), updatedMessage];

			return newMessages;
		});

	const finalMessage = async () => {
		fn();
		// TODO: This is a hack to ensure the message is persisted to database before refetching
		// This should probably poll the server until the message is persisted
		await new Promise((resolve) => setTimeout(resolve, 1000));
		client.message.invalidate();
	};

	return api.chat.init.useMutation({
		onMutate: () => client.message.all.cancel(),
		onError: (error) => console.error(error),
		onSuccess: async (res) => {
			try {
				if (res instanceof Response) {
					if (!res.body) throw new Error("No stream found");
					const streamHandler = getStreamProcessor({
						stream: res.body as any,
						addMessage,
						updateMessage,
						finalMessage,
					});

					await streamHandler;
				} else {
					addMessage(res);
					emitFeedback();
					finalMessage();
				}
			} catch (error) {
				console.error(error);
				client.message.invalidate();
			}
		},
	});
};
