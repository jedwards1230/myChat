import { ChatView } from "@/components/views/chat";
import { useConfigStore } from "@/lib/stores/configStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Chat() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const setThreadId = useConfigStore((s) => s.setThreadId);
	useEffect(() => {
		setThreadId(id);
		//return () => setThreadId(null);
	}, [id]);

	return <ChatView threadId={id} />;
}

export { ErrorBoundary } from "expo-router";
