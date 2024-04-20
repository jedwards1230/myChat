import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import { useUserData } from "@/hooks/stores/useUserData";

export default function AuthLayout() {
    const params = useLocalSearchParams();
    const session = useUserData.use.session();

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
