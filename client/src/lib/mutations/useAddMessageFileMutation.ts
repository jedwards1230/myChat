import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "../utils";
import type { CacheFile, Message } from "@/types";
import { useFileStore } from "../stores/fileStore";

export type PostMessageOptions = {
	messageId: string;
	threadId: string;
	fileList: CacheFile[];
};

const postMessage = async (
	{ messageId, threadId, fileList }: PostMessageOptions,
	userId: string
): Promise<Message> => {
	const formData = await buildFormData(fileList);
	const message = await fetcher<Message>(
		[`/threads/${threadId}/messages/${messageId}/files`, userId],
		{ method: "POST", body: formData, file: true }
	);
	return message;
};

/** Post a message file to the server */
export const useAddMessageFileMutation = () => {
	const { user } = useConfigStore();
	const { reset, setFiles } = useFileStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessageFile"],
		mutationFn: async (opts: PostMessageOptions) => postMessage(opts, user.id),
		onMutate: async () => reset(),
		onError: (error, { fileList }) => {
			setFiles(fileList);
			console.error(error);
		},
		onSettled: (res, err, opts) => {
			queryClient.invalidateQueries({
				queryKey: [user.id, opts.threadId],
			});
			queryClient.refetchQueries({
				queryKey: [user.id, "threads"],
			});
		},
	});
};

const buildFormData = async (fileList: CacheFile[]) => {
	const formData = new FormData();
	Array.from(fileList).forEach((f) => f.file && formData.append("files", f.file));
	return formData;
};
