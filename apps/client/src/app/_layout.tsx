import "./global.css";
import "@/lib/polyfills";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Head from "expo-router/head";

import { PortalHost } from "@/components/primitives/portal";
import { Providers } from "@/providers";

export const unstable_settings = {
    initialRouteName: "(app)/index",
    auth: { initialRouteName: "(auth)/index" },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    return loaded ? <RootProviders /> : null;
}

function RootProviders() {
    return (
        <Providers>
            <Head>
                <title>myChat</title>
            </Head>
            <Stack
                initialRouteName="(app)/index.tsx"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#fff" },
                }}
            >
                <Stack.Screen name="(app)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="file/[id]" options={{ presentation: "modal" }} />
                <Stack.Screen name="agent/index" options={{ presentation: "modal" }} />
                <Stack.Screen name="agent/[id]" options={{ presentation: "modal" }} />
                <Stack.Screen name="agent/create/index" />
                <Stack.Screen name="settings" options={{ presentation: "modal" }} />
            </Stack>
            <PortalHost />
        </Providers>
    );
}

export { ErrorBoundary } from "expo-router";
