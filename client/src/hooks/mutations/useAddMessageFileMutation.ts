import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfigStore } from "@/hooks/stores/configStore";
import { fetcher } from "@/lib/fetcher";
import type { Message } from "@/types";
import { useFileStore } from "../stores/fileStore";
import { messagesQueryOptions } from "../queries/useMessagesQuery";
import { FileInformation } from "../useFileInformation";

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
	fileList: FileInformation[];
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
		onMutate: async ({ threadId, messageId, fileList }) => {
			const messagesQuery = messagesQueryOptions(user.id, threadId);
			const cached = queryClient.getQueryData(messagesQuery.queryKey);
			queryClient.cancelQueries(messagesQuery);

			// verify messageId in cached messages
			const messageExists = cached?.find((m: Message) => m.id === messageId);
			if (!messageExists) throw new Error("Message not found");

			// Add the files to the message
			const prevMessages = cached || [];
			const messages = prevMessages.map((m: Message) =>
				m.id === messageId ? { ...m, files: fileList } : m
			) as Message[];

			queryClient.setQueryData(messagesQuery.queryKey, messages as any[]);
			reset();

			return { prevMessages, fileList };
		},
		onError: (error, { fileList, threadId }) => {
			setFiles(fileList);
			queryClient.invalidateQueries(messagesQueryOptions(user.id, threadId));
			console.error(error);
		},
		onSettled: (res, err, opts) => {
			queryClient.invalidateQueries(messagesQueryOptions(user.id, opts.threadId));
		},
	});
};

const buildFormData = async (fileList: FileInformation[]) => {
	const formData = new FormData();
	fileList.forEach((f, index) => {
		console.log("prepping", f);
		if (!f.file) throw new Error("File not found");
		// Append file buffer
		formData.append(`file${index}`, f.file, f.name);

		// Clone to avoid mutating original object when deleting file key
		const metadata = { ...f };
		delete metadata.buffer; // Remove the file object

		// Append metadata as a JSON string
		formData.append(`metadata${index}`, JSON.stringify(metadata));
	});
	return formData;
};
