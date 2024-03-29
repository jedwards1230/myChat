import { useEffect, useState } from "react";

import { useConfigStore } from "@/lib/stores/configStore";
import { useStreamChat } from "./useStreamChat";
import { useJSONChat } from "./useJSONChat";
import { useFileStore } from "../stores/fileStore";
import { useAddMessageMutation } from "../mutations/useAddMessageMutation";
import { useCreateThreadMutation } from "../mutations/useCreateThreadMutation";
import { useAddMessageFileMutation } from "../mutations/useAddMessageFileMutation";

export type FormSubmission = (input: string) => Promise<true | void>;

type ChatStatus = "idle" | "loading" | "error";
type RequestStatus =
	| "ready"
	| "no-thread"
	| "creating-thread"
	| "message-sent"
	| "adding-files"
	| "requesting-chat"
	| "chat-requested";

export const useChat = (): {
	loading: boolean;
	handleSubmit: FormSubmission;
	abort: () => void;
} => {
	const threadId = useConfigStore((state) => state.threadId);
	const fileList = useFileStore((state) => state.fileList);

	const [input, setInput] = useState<string | null>(null);
	const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");
	const [reqStatus, setReqStatus] = useState<RequestStatus>(
		threadId ? "ready" : "no-thread"
	);

	const { requestChat, abort, loading } = useResponseChat();

	const {
		mutate: sendMessage,
		data: message,
		reset: resetMessage,
		status: mStatus,
	} = useAddMessageMutation();
	const { mutate: createThread, data: thread } = useCreateThreadMutation();
	const { mutate: addMessageFile } = useAddMessageFileMutation();

	useEffect(() => {
		if (reqStatus === "creating-thread" && thread) {
			setReqStatus("ready");
		}
	}, [thread]);

	useEffect(() => {
		if (mStatus === "error") {
			setChatStatus("error");
			console.error({ mStatus });
		}
	}, [mStatus]);

	useEffect(() => {
		if (chatStatus !== "loading") return;
		if (reqStatus === "creating-thread") return;

		switch (reqStatus) {
			case "no-thread":
				createThread();
				setReqStatus("creating-thread");
				break;

			case "ready":
				const id = thread?.id || threadId;
				if (!id) return setReqStatus("no-thread");

				if (mStatus === "idle") {
					sendMessage({
						threadId: id,
						message: {
							role: "user",
							content: input ?? "",
						},
					});
					setReqStatus("message-sent");
					setInput(null);
				}
				break;

			case "message-sent":
				if (mStatus !== "success") return;
				if (fileList.length > 0) {
					if (!message) throw new Error("No message");
					if (!threadId) throw new Error("No threadId");
					addMessageFile({
						threadId,
						messageId: message?.id,
						fileList,
					});
					setReqStatus("adding-files");
				} else {
					setReqStatus("requesting-chat");
				}

			case "requesting-chat":
				if (mStatus === "success") {
					requestChat();
					setReqStatus("chat-requested");
				}
				break;

			case "chat-requested":
				resetMessage();
				setChatStatus("idle");
				setReqStatus("ready");
				break;
		}
	}, [reqStatus, chatStatus, mStatus, threadId]);

	const handleSubmit: FormSubmission = async (input) => {
		try {
			if (!input && !fileList) throw new Error("No input or file");
			setInput(input);
			setChatStatus("loading");
		} catch (error) {
			setChatStatus("error");
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
};

const useResponseChat = () => {
	const stream = useConfigStore((state) => state.stream);
	return stream ? useStreamChat() : useJSONChat();
};
