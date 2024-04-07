import { useState } from "react";

import { useChatResponse } from "./useChatResponse";
import { useThreadManager } from "./useThreadManager";

export type FormSubmission = (input: string) => Promise<true | void>;

export function useChat(initialThreadId: string | null) {
	const [isRunning, setIsRunning] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const threadManager = useThreadManager(initialThreadId);
	const chatResponseManager = useChatResponse();

	const reset = (threadId?: string | null) => {
		setIsRunning(false);
		threadManager.reset(threadId);
	};

	const abort = () => {
		reset();
		chatResponseManager.abort();
	};

	const handleSubmit: FormSubmission = async (input) => {
		setIsRunning(true);
		try {
			const { message, threadId } = await threadManager.onSubmit(
				initialThreadId,
				input
			);
			chatResponseManager.requestChat(threadId);
			reset(threadId);
			return true;
		} catch (error) {
			setError("Failed to send message");
			reset();
			console.error(error);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		error,
		loading:
			threadManager.isMutating || chatResponseManager.isResponding || isRunning,
		handleSubmit,
		abort,
	};
}
