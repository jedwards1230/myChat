import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
	ThreadSchema as Thread,
	ThreadPatchSchema,
} from "@mychat/shared/schemas/Thread";

import { messagesQueryOptions } from "../Message/useMessagesQuery";

type ThreadPatchOptions = {
	threadId: string;
} & ThreadPatchSchema;

const createThread = async ({ threadId, ...rest }: ThreadPatchOptions, apiKey: string) =>
	fetcher<Thread>(`/threads/${threadId}`, {
		apiKey,
		method: "PATCH",
		body: JSON.stringify(rest),
	});

/** Patch Thread data on the server */
export function useThreadPatch() {
	const apiKey = useUserData((s) => s.apiKey);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createThread"],
		mutationFn: async (opts: ThreadPatchOptions) => createThread(opts, apiKey),
		onError: (error) => console.error(error),
		onSettled: (_, __, { threadId }) =>
			queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId)),
	});
}
