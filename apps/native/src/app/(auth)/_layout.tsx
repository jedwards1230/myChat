import { Redirect, Stack } from "expo-router";

import { useUserData } from "@/hooks/stores/useUserData";

export default function AuthLayout() {
    const session = useUserData.use.session();

    if (session) return <Redirect href={{ pathname: "/(app)" }} />;
    return <Stack screenOptions={{ headerShown: false }} />;
}

export { ErrorBoundary } from "expo-router";
