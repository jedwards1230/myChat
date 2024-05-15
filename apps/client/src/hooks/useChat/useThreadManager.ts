import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import type { Message } from "@/types";
import { useFileStore } from "../stores/fileStore";
import { useMessagePost } from "../fetchers/Message/useMessagePost";
import { useThreadPost } from "../fetchers/Thread/useThreadPost";
import { useMessageFilePost } from "../fetchers/Message/useMessageFilePost";
import { useMessagesQuery } from "../fetchers/Message/useMessagesQuery";

type FormSubmission = (
    threadId: string | null,
    input: string
) => Promise<{
    message: Message;
    threadId: string;
}>;

export const useThreadManager = (initialThreadId: string | null) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId);

    const fileList = useFileStore.use.fileList();
    const messagesQuery = useMessagesQuery(activeThreadId);
    const createThreadMut = useThreadPost();
    const addMessageMut = useMessagePost();
    const addMessageFileMut = useMessageFilePost();

    useEffect(() => {
        if (initialThreadId !== activeThreadId) return;
        setActiveThreadId(initialThreadId);
    }, [initialThreadId]);

    const isMutating =
        addMessageMut.isPending ||
        createThreadMut.isPending ||
        addMessageFileMut.isPending;

    const onSubmit: FormSubmission = async (threadId, input) => {
        if (!input && !fileList) {
            setError("No input or file");
            throw new Error("No input or file");
        }
        return threadId ? onReady(threadId, input) : onNoThread(threadId, input);
    };

    const reset = (threadId?: string | null) => {
        if (threadId !== undefined) setActiveThreadId(threadId);
        addMessageMut.reset();
        createThreadMut.reset();
        addMessageFileMut.reset();
    };

    const onNoThread = async (threadId: string | null, input: string) => {
        try {
            const res = await createThreadMut.mutateAsync();
            if (res.id !== threadId) {
                router.setParams({ c: res.id });
                setActiveThreadId(res.id);
            }

            createThreadMut.reset();
            return onReady(res.id, input);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create thread");
        }
    };

    const onReady = async (threadId: string, input: string) => {
        const res = await addMessageMut.mutateAsync({
            threadId,
            message: { role: "user", content: input ?? "" },
        });
        if (!res) throw new Error("No message data");
        await messagesQuery.refetch();

        if (fileList && fileList.length > 0) {
            await addMessageFileMut.mutateAsync({
                threadId,
                messageId: res.id,
                fileList,
            });
            await messagesQuery.refetch();
        }

        return { message: res, threadId };
    };

    return {
        isMutating,
        error,
        onSubmit,
        reset,
        onNoThread,
        onReady,
    };
};
