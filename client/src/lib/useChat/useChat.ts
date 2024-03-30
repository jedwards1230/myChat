import { useEffect, useState } from "react";

import { useConfigStore } from "@/lib/stores/configStore";
import { useStreamChat } from "./useStreamChat";
import { useJSONChat } from "./useJSONChat";
import { useFileStore } from "../stores/fileStore";
import { useAddMessageMutation } from "../mutations/useAddMessageMutation";
import { useCreateThreadMutation } from "../mutations/useCreateThreadMutation";
import { useAddMessageFileMutation } from "../mutations/useAddMessageFileMutation";

export type FormSubmission = (input: string) => Promise<true | void>;

type ChatStatus = "idle" | "loading";
type RequestStatus =
	| "ready"
	| "no-thread"
	| "creating-thread"
	| "message-sent"
	| "adding-files"
	| "requesting-chat"
	| "chat-requested";

export function useChat() {
	const threadId = useConfigStore((state) => state.threadId);
	const fileList = useFileStore((state) => state.fileList);

	const [input, setInput] = useState<string | null>(null);
	const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");
	const [reqStatus, setReqStatus] = useState<RequestStatus>(
		threadId ? "ready" : "no-thread"
	);

	const { requestChat, abort, loading } = useResponseChat();

	const addMessageMut = useAddMessageMutation();
	useEffect(() => {
		if (addMessageMut.status === "error")
			console.error({ addMessageMut: addMessageMut.error });
	}, [addMessageMut.status]);

	const createThreadMut = useCreateThreadMutation();
	useEffect(() => {
		if (createThreadMut.status === "error")
			console.error({ createThreadMut: createThreadMut.error });
	}, [createThreadMut.status]);

	const addMessageFileMut = useAddMessageFileMutation();
	useEffect(() => {
		if (addMessageFileMut.status === "error")
			console.error({ addMessageFileMut: addMessageFileMut.error });
	}, [addMessageFileMut.status]);

	const reset = () => {
		setReqStatus(threadId ? "ready" : "no-thread");
		setChatStatus("idle");
		addMessageMut.reset();
		createThreadMut.reset();
		addMessageFileMut.reset();
	};

	useEffect(() => {
		if (reqStatus === "creating-thread" && createThreadMut.data) {
			setReqStatus("ready");
		}
	}, [createThreadMut.data]);

	useEffect(() => {
		if (chatStatus === "idle") return;
		if (reqStatus === "creating-thread") return;

		switch (reqStatus) {
			case "no-thread":
				createThreadMut.mutate();
				setReqStatus("creating-thread");
				break;

			case "ready":
				const id = createThreadMut.data?.id || threadId;
				if (!id) return setReqStatus("no-thread");
				if (addMessageMut.status !== "idle") return;

				addMessageMut.mutate({
					threadId: id,
					message: {
						role: "user",
						content: input ?? "",
					},
				});
				setReqStatus("message-sent");
				setInput(null);
				break;

			case "message-sent":
				if (addMessageMut.status !== "success") return;
				if (addMessageFileMut.status !== "idle") return;
				if (fileList.length > 0) {
					if (!threadId) throw new Error("No threadId");
					addMessageFileMut.mutate({
						threadId,
						messageId: addMessageMut.data.id,
						fileList,
					});
					setReqStatus("adding-files");
				} else {
					setReqStatus("requesting-chat");
				}
				break;

			case "adding-files":
				if (addMessageFileMut.status === "success") {
					setReqStatus("requesting-chat");
				}
				break;

			case "requesting-chat":
				if (addMessageMut.status === "success") {
					requestChat();
					setReqStatus("chat-requested");
				}
				break;

			case "chat-requested":
				reset();
				setChatStatus("idle");
				setReqStatus("ready");
				break;
		}
	}, [reqStatus, chatStatus, addMessageMut.status, addMessageFileMut.status, threadId]);

	const handleSubmit: FormSubmission = async (input) => {
		try {
			if (!input && !fileList) throw new Error("No input or file");
			setInput(input);
			setChatStatus("loading");
		} catch (error) {
			setReqStatus(threadId ? "ready" : "no-thread");

			console.error(error);
			throw error;
		}
	};

	return {
		loading,
		handleSubmit,
		abort,
	};
}

function useResponseChat() {
	const stream = useConfigStore((state) => state.stream);
	return stream ? useStreamChat() : useJSONChat();
}
