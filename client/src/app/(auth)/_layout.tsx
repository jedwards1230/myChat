import { useUserData } from "@/hooks/stores/useUserData";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
	const session = useUserData((s) => s.session);
	if (session) return <Redirect href="/(main)" />;
	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="signup" options={{ headerShown: false }} />
		</Stack>
	);
}

export { ErrorBoundary } from "expo-router";
