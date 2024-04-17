import { useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";

import { ChatView } from "@/views/chat";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function Chat() {
	const { c } = useGlobalSearchParams<{ c?: string }>();
	const setThreadId = useConfigStore((s) => s.setThreadId);
	useEffect(() => setThreadId(c || null), [c]);
	return <ChatView threadId={c || null} />;
}

export { ErrorBoundary } from "expo-router";
