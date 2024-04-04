import { useEffect, useRef } from "react";

import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";

export const useChatResponse = (threadId: string | null) => {
	const { mutate: getChat, data, reset, isPending } = useRequestChatMutation();
	const { mutate: generateTitle } = useRequestThreadTitleMutation(threadId);
	const abortController = useRef(new AbortController());

	useEffect(() => {
		if (!data) return;
		console.log("Stream finished");
		reset();
		generateTitle();
	}, [data]);

	const requestChat = async () => {
		if (!threadId) return;
		getChat({ threadId, signal: abortController.current.signal });
	};

	const abort = () => {
		if (!threadId) return console.warn("No thread to abort");
		abortController.current.abort();
		abortController.current = new AbortController();
		reset();
		console.log("Aborted chat request");
	};

	return { requestChat, abort, isResponding: isPending };
};
