import { useGlobalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect } from "react";

import { ChatView } from "@/views/chat";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function Chat() {
	const { c } = useGlobalSearchParams<{ c?: string }>();
	const setThreadId = useConfigStore((s) => s.setThreadId);
	useEffect(() => setThreadId(c || null), [c]);
	return (
		<>
			<Head>
				<title>myChat{c ? ` | ${c}` : ""}</title>
			</Head>
			<ChatView threadId={c || null} />
		</>
	);
}

export { ErrorBoundary } from "expo-router";
