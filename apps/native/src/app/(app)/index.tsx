import { useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useConfigStore } from "@/hooks/stores/configStore";
import { ChatView } from "@/views/chat";

export default function Chat() {
	const { c } = useGlobalSearchParams<{ c?: string }>();
	const setThreadId = useConfigStore.use.setThreadId();
	useEffect(() => setThreadId(c ?? null), [c]);

	return (
		<>
			<Head>
				<title>myChat{c ? ` | ${c}` : ""}</title>
			</Head>
			<ChatView threadId={c ?? null} />
		</>
	);
}

export { ErrorBoundary } from "expo-router";
