import { ChatView } from "@/components/views/chat";
import { useConfigStore } from "@/hooks/stores/configStore";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Chat() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const isFocused = useIsFocused();

	const { threadId, setThreadId } = useConfigStore();
	useEffect(() => setThreadId(id), [id]);

	if (!isFocused) return null;
	if (id !== threadId) {
		console.warn("Thread ID mismatch", { id, threadId });
		return null;
	}
	return <ChatView threadId={id} />;
}

export { ErrorBoundary } from "expo-router";
