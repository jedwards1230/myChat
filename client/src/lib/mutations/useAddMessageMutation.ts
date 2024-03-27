import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher, FetchError } from "../utils";
import type { CacheFile, Message } from "@/types";
import { useFileStore } from "../stores/fileStore";

export type PostMessageOptions = {
	message: Message;
	threadId: string | null;
	fileList?: CacheFile[];
};

const postMessage = async (
	opts: PostMessageOptions,
	userId: string
): Promise<{ message: Message; threadId: string }> => {
	const formData = await buildFormData(opts);
	const { threadId, ...message } = await fetcher<Message & { threadId: string }>(
		[`/threads/${opts.threadId}/messages`, userId],
		{
			method: "POST",
			body: formData,
		}
	);
	return { message: message as Message, threadId };
};

/** Post a message to the server */
export const useAddMessageMutation = () => {
	const { user, setThreadId } = useConfigStore();
	const { reset, setFiles } = useFileStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessage"],
		mutationFn: async (opts: PostMessageOptions) => postMessage(opts, user.id),
		onMutate: async (opts: PostMessageOptions) => {
			reset();
			const formData = await buildFormData(opts);
			if (!opts.threadId) return { formData };
			const prevMessages = queryClient.getQueryData<Message[]>([
				user.id,
				opts.threadId,
			]);

			queryClient.setQueryData<Message[]>(
				[user.id, opts.threadId],
				prevMessages ? [...prevMessages, opts.message] : [opts.message]
			);

			return { prevMessages, formData };
		},
		onError: (error, opts, context) => {
			if (opts.threadId && context?.prevMessages)
				queryClient.setQueryData([user.id, opts.threadId], context?.prevMessages);
			if (opts?.fileList) setFiles(opts?.fileList);
			console.error(error);
		},
		onSuccess: (res, opts, context) => {
			setThreadId(res.threadId);
			router.push({
				pathname: "/(chat)/",
				params: { c: res.threadId },
			});
		},
		onSettled: (res, err, opts, context) => {
			queryClient.invalidateQueries({
				queryKey: [user.id, opts.threadId],
			});
			queryClient.refetchQueries({
				queryKey: [user.id, "threads"],
			});
		},
	});
};

const buildFormData = async ({ message, threadId, fileList }: PostMessageOptions) => {
	const formData = new FormData();
	formData.append("message", JSON.stringify(message));

	if (threadId) {
		formData.append("threadId", threadId);
	}
	if (fileList) {
		Array.from(fileList).forEach((f) => {
			console.log("appending file", JSON.stringify(f.file));
			formData.append("files", f.file as File);
		});
	}

	return formData;
};
