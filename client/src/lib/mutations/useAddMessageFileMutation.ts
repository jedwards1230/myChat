import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/lib/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import type { Message } from "@/types";
import { useFileStore } from "../stores/fileStore";

type CacheFile = {
	name: string;
	size?: number | undefined;
	uri: string;
	mimeType?: string | undefined;
	lastModified?: number | undefined;
	file?: File | undefined;
	relativePath?: string;
};

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
		},
	});
};

const buildFormData = async (fileList: CacheFile[]) => {
	const formData = new FormData();
	// TODO: Pass the CacheFile metadata to the server
	fileList.forEach((f, index) => {
		if (f.file) {
			// Append file buffer
			formData.append(`file${index}`, f.file, f.name);

			// Clone to avoid mutating original object when deleting file key
			const metadata = { ...f };
			delete metadata.file; // Remove the file object

			// Append metadata as a JSON string
			formData.append(`metadata${index}`, JSON.stringify(metadata));
		}
	});
	return formData;
};
