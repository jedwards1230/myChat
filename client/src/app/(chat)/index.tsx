import { ChatView } from "@/components/views/chat";
import { useConfigStore } from "@/lib/stores/configStore";
import { useEffect } from "react";

export default function Chat() {
	const setThreadId = useConfigStore((s) => s.setThreadId);
	useEffect(() => {
		setThreadId(null);
	}, []);
	return <ChatView threadId={null} />;
}

export { ErrorBoundary } from "expo-router";
