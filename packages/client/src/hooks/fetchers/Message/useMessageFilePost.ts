import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import type { Message, MessageFile } from "@/types";
import { useFileStore } from "../../stores/fileStore";
import { messagesQueryOptions } from "./useMessagesQuery";
import { type FileInformation, toMessageFile } from "../../useFileInformation";
import { filesQueryOptions } from "./useFilesQuery";

export type PostMessageFileOptions = {
	messageId: string;
	threadId: string;
	fileList: FileInformation[];
};

const postMessageFile = async (
	{ messageId, threadId, fileList }: PostMessageFileOptions,
	apiKey: string
): Promise<Message> => {
	const formData = await buildFormData(fileList);
	const message = await fetcher<Message>(
		`/threads/${threadId}/messages/${messageId}/files`,
		{ method: "POST", body: formData, file: true, apiKey }
	);
	return message;
};

/** Post a message file to the server */
export const useMessageFilePost = () => {
	const apiKey = useUserData((s) => s.apiKey);
	const { reset, setFiles } = useFileStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["postMessageFile"],
		mutationFn: async (opts: PostMessageFileOptions) => postMessageFile(opts, apiKey),
		onMutate: async ({ threadId, messageId, fileList }) => {
			const messagesQuery = messagesQueryOptions(apiKey, threadId);
			const filesQuery = filesQueryOptions(apiKey, threadId, messageId);

			const cacheMessages = async () => {
				const cached = queryClient.getQueryData(messagesQuery.queryKey);
				await queryClient.cancelQueries(messagesQuery);

				// Add the files to the message
				const prevMessages = cached || [];
				const messages = prevMessages.map((m: Message) =>
					m.id === messageId ? { ...m, files: fileList } : m
				) as Message[];

				queryClient.setQueryData(messagesQuery.queryKey, messages);

				return messages;
			};

			const cacheFiles = async () => {
				const cached = queryClient.getQueryData(filesQuery.queryKey);
				await queryClient.cancelQueries(filesQuery);

				// Add the optimistic files to cache
				const prevFiles = cached || [];
				const files = fileList.map((f) => toMessageFile(f));

				// Merge prevFiles and files, ensuring each object is unique by id
				const mergedFiles = [...files, ...prevFiles].reduce(
					(unique: MessageFile[], item) => {
						return unique.find((file) => file.id === item.id)
							? unique
							: [...unique, item];
					},
					[]
				);

				queryClient.setQueryData(filesQuery.queryKey, mergedFiles);

				return mergedFiles;
			};

			const [prevMessages, mergedFiles] = await Promise.all([
				cacheMessages(),
				cacheFiles(),
			]);

			reset();
			return { prevMessages, fileList, mergedFiles };
		},
		onError: async (error, { fileList, threadId }) => {
			console.error(error);
			setFiles(fileList);
			await queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId));
		},
		onSettled: async (res, err, opts) => {
			await Promise.all([
				queryClient.invalidateQueries(
					messagesQueryOptions(apiKey, opts.threadId)
				),
				queryClient.invalidateQueries(
					filesQueryOptions(apiKey, opts.threadId, opts.messageId)
				),
			]);
		},
	});
};

const buildFormData = async (fileList: FileInformation[]) => {
	const formData = new FormData();
	fileList.forEach((f, index) => {
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
