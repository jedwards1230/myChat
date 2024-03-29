import { useState, useEffect } from "react";

import type { SocketClientMessage, SocketServerMessage } from "@/types";
import { formatUrl, handleSocketMessage } from "@/utils/chat.ws";
import { useConfigStore } from "@/lib/stores/configStore";
import { useMessagesQueryHelpers } from "../queries/useMessagesQuery";

const useSocket = () => {
	const [loading, setLoading] = useState(false);
	const { host, user, threadId } = useConfigStore();
	const { addMessage, updateMessage, finishMessage } = useMessagesQueryHelpers(
		threadId,
		setLoading
	);

	const [socketUrl, setSocketUrl] = useState(formatUrl(host, user.id));
	useEffect(() => setSocketUrl(formatUrl(host, user.id)), [host, user.id]);

	const [ws, setWs] = useState<WebSocket | null>(null);

	const resetWs = () => {
		ws?.close();
		setWs(null);
	};

	const sendJsonMessage = (message: SocketClientMessage, keep?: boolean) => {
		if (ws) {
			ws.send(JSON.stringify(message));
		} else {
			console.error("WebSocket not connected");
		}
	};

	const readyState = ws?.readyState ?? ReadyState.UNINSTANTIATED;
	const [lastMessage, setLastMessage] = useState<SocketServerMessage | null>(null);
	useEffect(() => {
		const ws = new WebSocket(socketUrl);
		setWs(ws);

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setLastMessage(message);
		};

		ws.onerror = (error) => {
			console.error("WebSocket error", error);
		};

		return () => {
			ws.close();
		};
	}, [socketUrl]);

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

	const abort = () => {
		sendJsonMessage({ type: "abort" });
		setLoading(false);
		resetWs();
	};

	/* useEffect(() => {
		switch (readyState) {
			case ReadyState.CONNECTING:
				setLoading(true);
				break;
			case ReadyState.OPEN:
				setLoading(false);
				break;
			case ReadyState.CLOSING:
				setLoading(false);
				break;
			case ReadyState.CLOSED:
				setLoading(false);
				break;
			case ReadyState.UNINSTANTIATED:
				setLoading(true);
				break;
		}
	}, [readyState]); */

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

	return { requestChatResponse, abort, loading };
};

export default useSocket;

enum ReadyState {
	CONNECTING = 0,
	OPEN = 1,
	CLOSING = 2,
	CLOSED = 3,
	UNINSTANTIATED = 4,
}
