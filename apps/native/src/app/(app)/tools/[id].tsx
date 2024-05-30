import { Stack, useLocalSearchParams } from "expo-router";

import { ToolConfig } from "@mychat/views/pages/tools/[id]/ToolConfig";

export default function Tool() {
	const { id } = useLocalSearchParams<{ id: string }>();
	return (
		<>
			<Stack.Screen options={{ presentation: "modal" }} />
			<ToolConfig id={id} />
		</>
	);
}

export { ErrorBoundary } from "expo-router";
