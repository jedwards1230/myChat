import { ToolConfig } from "@/views/tools/[id]/ToolConfig";
import { Stack, useLocalSearchParams } from "expo-router";

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
