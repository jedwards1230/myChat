import { useEffect, useRef } from "react";

import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import type { UseMutationResult } from "@tanstack/react-query";

export const useChatResponse = (threadId: string | null) => {
	const chatMut = useRequestChatMutation();
	const { mutate: getChat, data, reset, isPending } = chatMut;
	const abortController = useRef(new AbortController());

	useEffect(() => {
		if (!data) return;
		reset();
	}, [data]);

	const requestChat = async (threadId: string) => {
		getChat({ threadId, signal: abortController.current.signal });
	};

	const abort = () => {
		abortController.current.abort();
		abortController.current = new AbortController();
		reset();
	};

	return { requestChat, abort, isResponding: isPending };
};
