import { useEffect, useState } from "react";

import type { Message } from "@/types";

import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQuery } from "../queries/useMessagesQuery";
import { useStreamChat } from "./useStreamChat";
import { useJSONChat } from "./useJSONChat";
import { useAddMessageMutation } from "../mutations/useAddMessageMutation";
import { useFileStore } from "../stores/fileStore";

export type FormSubmission = (input: string) => Promise<true | void>;

export const useChat = (): {
	loading: boolean;
	handleSubmit: FormSubmission;
} => {
	const [loading, setLoading] = useState(false);
	const [chatRequested, setChatRequested] = useState(false);

	const threadId = useConfigStore((state) => state.threadId);
	const fileList = useFileStore((state) => state.fileList);

	const { requestChat } = useResponseChat();

	const { status: qStatus } = useMessagesQuery(threadId);
	const { mutate: sendMessage, status: mStatus } = useAddMessageMutation();

	const handleSubmit: FormSubmission = async (input) => {
		try {
			if (!input && !fileList) throw new Error("No input or file");
			setLoading(true);
			setChatRequested(true);

			sendMessage({
				message: {
					role: "user",
					content: input ?? "",
				} as Message,
				threadId,
				fileList,
			});

			return true;
		} catch (error) {
			console.error(error);
			setLoading(false);
			setChatRequested(false);
			throw error;
		}
	};

	useEffect(() => {
		if (chatRequested && mStatus === "success" && qStatus === "success") {
			requestChat().then(() => {
				setLoading(false);
				setChatRequested(false);
			});
		}
	}, [mStatus, qStatus]);

	return {
		loading,
		handleSubmit,
	};
};

const useResponseChat = () => {
	const stream = useConfigStore((state) => state.stream);
	return stream ? useStreamChat() : useJSONChat();
};
