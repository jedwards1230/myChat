import { useEffect, useState } from "react";

import { useConfigStore } from "@/lib/stores/configStore";
import { useChatResponse } from "./useChatResponse";
import { useFileStore } from "../stores/fileStore";
import { useAddMessageMutation } from "../mutations/useAddMessageMutation";
import { useCreateThreadMutation } from "../mutations/useCreateThreadMutation";
import { useAddMessageFileMutation } from "../mutations/useAddMessageFileMutation";

export type FormSubmission = (input: string) => Promise<true | void>;

type RequestStatus =
	| "ready"
	| "no-thread"
	| "creating-thread"
	| "message-sent"
	| "adding-files"
	| "requesting-chat";

export function useChat() {
	const threadId = useConfigStore((state) => state.threadId);
	const fileList = useFileStore((state) => state.fileList);

	const [input, setInput] = useState<string | null>(null);
	const [isIdle, setIsIdle] = useState(true);
	const [reqStatus, setReqStatus] = useState<RequestStatus>(
		threadId ? "ready" : "no-thread"
	);

	const { requestChat, abort, loading } = useChatResponse(threadId);

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
		setIsIdle(true);
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
		if (isIdle) return;
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
					reset();
				}
				break;
		}
	}, [reqStatus, isIdle, addMessageMut.status, addMessageFileMut.status, threadId]);

	const handleSubmit: FormSubmission = async (input) => {
		if (!input && !fileList) {
			console.error("No input or file");
			throw new Error("No input or file");
		}
		setInput(input);
		setIsIdle(false);
	};

	return {
		loading: loading || !isIdle,
		handleSubmit,
		abort,
	};
}
