import { useConfigStore } from "@/hooks/stores/configStore";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
	const user = useConfigStore((state) => state.user);
	if (user) return <Redirect href="/(chat)" />;
	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="signup" options={{ headerShown: false }} />
		</Stack>
	);
}

export { ErrorBoundary } from "expo-router";
