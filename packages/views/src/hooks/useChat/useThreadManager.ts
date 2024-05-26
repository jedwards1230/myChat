import { useEffect, useState } from "react";
import { useRouter } from "solito/navigation";

import type { Message } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";

import { useFileStore } from "./fileStore";

type FormSubmission = (
	threadId: string,
	input: string,
) => Promise<{
	message: Message;
	threadId: string;
}>;

export const useThreadManager = (initialThreadId: string | null) => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId);

	const fileList = useFileStore.use.fileList();
	const messagesQuery = api.message.byId.useQuery(
		{ id: activeThreadId ?? "" },
		{ enabled: !!activeThreadId },
	);
	const createThreadMut = api.thread.create.useMutation();
	const addMessageMut = api.message.create.useMutation();
	const addMessageFileMut = api.messageFile.create.useMutation();

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

	const onNoThread: FormSubmission = async (threadId: string | null, input: string) => {
		try {
			const res = await createThreadMut.mutateAsync({});
			const newThread = res[0];
			if (!newThread) throw new Error("No thread data");
			if (newThread.id !== threadId) {
				router.setParams({ c: newThread.id });
				setActiveThreadId(newThread.id);
			}

			createThreadMut.reset();
			return onReady(newThread.id, input);
		} catch (error) {
			console.error(error);
			throw new Error("Failed to create thread");
		}
	};

	const onReady: FormSubmission = async (threadId: string, input: string) => {
		const res = await addMessageMut.mutateAsync({
			role: "user",
			content: input ?? "",
		});
		const message = res[0];
		if (!message) throw new Error("No message data");
		await messagesQuery.refetch();

		if (fileList && fileList.length > 0) {
			/* await addMessageFileMut.mutateAsync({
				threadId,
				messageId: message.id,
				fileList,
			}); */
			await messagesQuery.refetch();
		}

		return { message, threadId };
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
