import { useEffect, useMemo, useState } from "react";

import { useRequestChatMutation } from "../mutations/useRequestChatMutation";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";

export const useChatResponse = (threadId: string | null) => {
	const [loading, setLoading] = useState(false);
	const thread = useMemo(() => threadId, [threadId]);

	const { mutate: getChat, data, reset } = useRequestChatMutation();
	const { mutate: generateTitle } = useRequestThreadTitleMutation(thread);

	useEffect(() => {
		if (!data) return;
		setLoading(false);
		reset();
		generateTitle();
	}, [data]);

	const requestChat = async () => {
		if (!thread) return;
		setLoading(true);
		getChat(thread);
	};

	const abort = () => {};

	return { requestChat, abort, loading };
};
