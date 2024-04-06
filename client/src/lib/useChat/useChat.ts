import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { useChatResponse } from "./useChatResponse";
import { useFileStore } from "../stores/fileStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";
import { useAddMessageMutation } from "../mutations/useAddMessageMutation";
import { useCreateThreadMutation } from "../mutations/useCreateThreadMutation";
import { useAddMessageFileMutation } from "../mutations/useAddMessageFileMutation";
import { useRequestThreadTitleMutation } from "../mutations/useRequestThreadTitleMutation";

export type FormSubmission = (input: string) => Promise<true | void>;

type RequestStatus =
	| "idle"
	| "ready"
	| "no-thread"
	| "creating-thread"
	| "adding-message"
	| "adding-files"
	| "requesting-chat";

export function useChat(threadId: string | null) {
	const router = useRouter();
	const [activeThreadId, setActiveThreadId] = useState<string | null>(threadId);
	const fileList = useFileStore((state) => state.fileList);

	const [input, setInput] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [reqStatus, setReqStatus] = useState<RequestStatus>("idle");

	const messagesQuery = useMessagesQuery(activeThreadId);
	const addMessageMut = useAddMessageMutation();
	const createThreadMut = useCreateThreadMutation();
	const addMessageFileMut = useAddMessageFileMutation();

	const { requestChat, abort, isResponding } = useChatResponse(activeThreadId);

	const isMutating =
		addMessageMut.isPending ||
		createThreadMut.isPending ||
		addMessageFileMut.isPending;

	const isPending = isMutating || isResponding || reqStatus !== "idle";
	const isReadyToProcess = !isMutating && !isResponding;

	const handleSubmit: FormSubmission = async (input) => {
		if (!input && !fileList) {
			setError("No input or file");
			throw new Error("No input or file");
		}
		setInput(input);
		setReqStatus(activeThreadId ? "ready" : "no-thread");
	};

	const reset = (threadId?: string | null) => {
		if (threadId !== undefined) setActiveThreadId(threadId);
		setInput(null);
		setReqStatus("idle");
		addMessageMut.reset();
		createThreadMut.reset();
		addMessageFileMut.reset();
	};

	// Handle mutation success
	// Lets a useEffect pass if the mutation is not ready to process
	// This will check the mutation each time its status changes
	const onMutationSuccess = <
		T extends
			| ReturnType<typeof useAddMessageMutation>
			| ReturnType<typeof useCreateThreadMutation>
			| ReturnType<typeof useAddMessageFileMutation>
			| ReturnType<typeof useRequestThreadTitleMutation>
	>(
		mutationObject: T,
		onSuccess: (data: NonNullable<T["data"]>) => void
	) => {
		if (mutationObject.isIdle)
			return console.warn(`No active mutation. Status: ${reqStatus}`);
		if (mutationObject.isPending) return;
		if (mutationObject.isSuccess) onSuccess(mutationObject.data);
		if (mutationObject.isError) {
			setError(mutationObject.error.message);
			reset();
		}
	};

	// Handle thread creation
	useEffect(() => {
		if (!isReadyToProcess || reqStatus !== "no-thread") return;
		createThreadMut.mutate();
		setReqStatus("creating-thread");
	}, [isReadyToProcess, reqStatus]);

	// Handle thread creation success
	// If thread creation is successful, reset the mutation and set the request status to "ready"
	useEffect(() => {
		if (!isReadyToProcess || reqStatus !== "creating-thread") return;
		onMutationSuccess(createThreadMut, (data) => {
			if (data.id !== activeThreadId) {
				router.push({ pathname: `/(chat)/c/${data.id}` });
				setActiveThreadId(data.id);
			}
			setReqStatus("ready");
			createThreadMut.reset();
		});
	}, [isReadyToProcess, reqStatus, createThreadMut.status]);

	// Handle message creation
	useEffect(() => {
		if (!isReadyToProcess || reqStatus !== "ready") return;
		if (!activeThreadId) return setReqStatus("no-thread");
		if (!addMessageMut.isIdle) return;

		addMessageMut.mutate({
			threadId: activeThreadId,
			message: { role: "user", content: input ?? "" },
		});
		setReqStatus("adding-message");
		setInput(null);
	}, [isReadyToProcess, reqStatus, activeThreadId, input, addMessageMut.status]);

	// Handle message creation success
	// If message creation is successful, check if there are files to upload
	// If there are files, start the file upload process
	// If there are no files, start the chat request process
	useEffect(() => {
		if (!isReadyToProcess || reqStatus !== "adding-message") return;
		onMutationSuccess(addMessageMut, () => {
			if (!activeThreadId) throw new Error("No threadId");
			if (fileList.length > 0) {
				if (!addMessageMut.data) throw new Error("No message data");

				addMessageFileMut.mutate({
					threadId: activeThreadId,
					messageId: addMessageMut.data.id,
					fileList,
				});
				setReqStatus("adding-files");
			} else {
				setReqStatus("requesting-chat");
			}
		});
	}, [
		isReadyToProcess,
		reqStatus,
		activeThreadId,
		fileList,
		addMessageMut.status,
		addMessageFileMut.status,
	]);

	// Handle file upload success
	useEffect(() => {
		if (!isReadyToProcess || reqStatus !== "adding-files") return;
		onMutationSuccess(addMessageFileMut, () => {
			if (!activeThreadId) throw new Error("No threadId");
			setReqStatus("requesting-chat");
		});
	}, [isReadyToProcess, reqStatus]);

	// Handle chat request success
	useEffect(() => {
		if (
			messagesQuery.isRefetching ||
			!isReadyToProcess ||
			reqStatus !== "requesting-chat" ||
			!activeThreadId
		)
			return;

		requestChat(activeThreadId);
		reset(threadId);
	}, [activeThreadId, reqStatus, isReadyToProcess, messagesQuery.isRefetching]);

	// Handle errors
	useEffect(() => {
		if (!error) return;
		console.error(error);
		reset();
	}, [error]);

	return {
		error,
		loading: isPending,
		handleSubmit,
		abort,
	};
}
