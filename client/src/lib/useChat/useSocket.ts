import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import type { SocketClientMessage, SocketServerMessage } from "@/types";
import { formatUrl, handleSocketMessage } from "@/utils/chat.ws";
import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQueryHelpers } from "../queries/useMessagesQuery";

const useSocket = (setLoading: (loading: boolean) => void) => {
	const { host, user, threadId } = useConfigStore();
	const { addMessage, updateMessage, finishMessage } =
		useMessagesQueryHelpers(threadId);

	const [socketUrl, setSocketUrl] = useState(formatUrl(host, user.id));
	useEffect(() => setSocketUrl(formatUrl(host, user.id)), [host, user.id]);

	const {
		sendJsonMessage,
		lastJsonMessage: lastMessage,
		readyState,
	} = useWebSocket<SocketServerMessage>(socketUrl);

	useEffect(() => {
		if (lastMessage === null) return;
		handleSocketMessage(lastMessage, {
			addMessage,
			updateMessage,
			finalMessage: () => {
				finishMessage();
				setLoading(false);
			},
		});
	}, [lastMessage]);

	const sendMessage = (message: SocketClientMessage, keep?: boolean) =>
		sendJsonMessage(message, keep);

	useEffect(() => {
		/* const connectionStatus = {
			[ReadyState.CONNECTING]: "Connecting",
			[ReadyState.OPEN]: "Open",
			[ReadyState.CLOSING]: "Closing",
			[ReadyState.CLOSED]: "Closed",
			[ReadyState.UNINSTANTIATED]: "Uninstantiated",
		}[readyState];  */

		switch (readyState) {
			case ReadyState.CONNECTING:
				setLoading(true);
				break;
			case ReadyState.OPEN:
				setLoading(false);
				break;
			case ReadyState.CLOSING:
				setLoading(true);
				break;
			case ReadyState.CLOSED:
				setLoading(true);
				break;
			case ReadyState.UNINSTANTIATED:
				setLoading(true);
				break;
		}
	}, [readyState]);

	const requestChatResponse = async (threadId: string) => {
		if (readyState === 1) {
			sendMessage({
				type: "getChat",
				data: { threadId, userId: user.id },
			});
		} else {
			alert("WebSocket not connected");
			console.error("WebSocket not connected", { readyState });
		}
	};

	return { requestChatResponse };
};

export default useSocket;
