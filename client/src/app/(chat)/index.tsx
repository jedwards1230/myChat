import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

import { ChatView } from "@/components/views/chat";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function Chat() {
	const isFocused = useIsFocused();

	const setThreadId = useConfigStore((s) => s.setThreadId);
	useEffect(() => setThreadId(null), []);

	if (!isFocused) return null;
	return <ChatView threadId={null} />;
}

export { ErrorBoundary } from "expo-router";
