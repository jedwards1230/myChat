import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useMessagesQuery } from "./fetchers/Message/useMessagesQuery";

export function useMessages(threadId: string) {
	const router = useRouter();
	const { isError, error, ...rest } = useMessagesQuery(threadId!);

	useEffect(() => {
		if (isError) {
			console.warn("Error fetching messages", error);
			router.push("/(app)");
		}
	}, [isError]);

	return { isError, ...rest };
}
