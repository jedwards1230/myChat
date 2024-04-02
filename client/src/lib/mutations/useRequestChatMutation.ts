import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

import { Message } from "@/types";
import { useConfigStore } from "../stores/configStore";
import { fetcher } from "@/lib/fetcher";

type FetcherResult<T> = T extends true ? Message : Response;

async function postChatRequest(
	threadId: string | null,
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

export type PostChatRequest = {
	threadId: string | null;
	userId: string;
};

export const useRequestChatMutation = () => {
	const { user, stream } = useConfigStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postChatRequest"],
		mutationFn: async (threadId: string | null) =>
			postChatRequest(threadId, user.id, stream),
		onError: (error) => console.error(error),
		onSettled: (res, err, threadId) =>
			queryClient.refetchQueries({
				queryKey: [user.id, threadId],
			}),
	});
};
