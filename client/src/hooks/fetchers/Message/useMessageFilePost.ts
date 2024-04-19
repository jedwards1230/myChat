import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import type { Message } from "@/types";
import { useFileStore } from "../../stores/fileStore";
import { messagesQueryOptions } from "./useMessagesQuery";
import { FileInformation } from "../../useFileInformation";

export type PostMessageOptions = {
    messageId: string;
    threadId: string;
    fileList: FileInformation[];
};

const postMessage = async (
    { messageId, threadId, fileList }: PostMessageOptions,
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
        mutationFn: async (opts: PostMessageOptions) => postMessage(opts, apiKey),
        onMutate: async ({ threadId, messageId, fileList }) => {
            const messagesQuery = messagesQueryOptions(apiKey, threadId);
            const cached = queryClient.getQueryData(messagesQuery.queryKey);
            queryClient.cancelQueries(messagesQuery);

            // verify messageId in cached messages
            const messageExists = cached?.find((m) => m.id === messageId);
            if (!messageExists) throw new Error("Message not found");

            // Add the files to the message
            const prevMessages = cached || [];
            const messages = prevMessages.map((m: Message) =>
                m.id === messageId ? { ...m, files: fileList } : m
            ) as Message[];

            queryClient.setQueryData(messagesQuery.queryKey, messages);
            reset();

            return { prevMessages, fileList };
        },
        onError: (error, { fileList, threadId }) => {
            setFiles(fileList);
            queryClient.invalidateQueries(messagesQueryOptions(apiKey, threadId));
            console.error(error);
        },
        onSettled: (res, err, opts) =>
            queryClient.invalidateQueries(messagesQueryOptions(apiKey, opts.threadId)),
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
