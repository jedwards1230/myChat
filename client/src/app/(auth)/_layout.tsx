import { useUser } from "@/hooks/useUser";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

export default function AuthLayout() {
    const params = useLocalSearchParams();
    const { loading, data } = useUser();

    if (loading) return null;
    if (data?.session) return <Redirect href={{ pathname: "/(main)", params }} />;
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}

export { ErrorBoundary } from "expo-router";
