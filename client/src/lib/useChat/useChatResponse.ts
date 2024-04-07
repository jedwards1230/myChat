import { useRef } from "react";

import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";

export const useChatResponse = () => {
	const chatMut = useRequestChatMutation();
	const titleMut = useRequestThreadTitleMutation();
	const abortController = useRef(new AbortController());

	const requestChat = async (threadId: string) => {
		await chatMut.mutateAsync({
			threadId,
			signal: abortController.current.signal,
		});
		chatMut.reset();
		titleMut
			.mutateAsync(threadId)
			.catch(console.error)
			.then(() => titleMut.reset());
	};

	const abort = () => {
		abortController.current.abort();
		abortController.current = new AbortController();
		chatMut.reset();
	};

	return { requestChat, abort, isResponding: chatMut.isPending };
};
