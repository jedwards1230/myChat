import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import { useUser } from "@/hooks/useUser";

export default function AuthLayout() {
    const params = useLocalSearchParams();
    const { loading, data: session } = useUser();

    if (loading) return null;
    if (session) return <Redirect href={{ pathname: "/(main)", params }} />;
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}

export { ErrorBoundary } from "expo-router";
