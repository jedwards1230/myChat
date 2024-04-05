import "./global.css";
import "@/lib/polyfills";

import "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppStateProvider } from "@/providers/AppStateProvider";
import NativeHapticsProvider from "@/providers/HapticsProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { HotkeyProvider } from "@/providers/HotkeyProvider";

import { PortalHost } from "@/components/primitives/portal";
import { Platform } from "react-native";

export const unstable_settings = {
	initialRouteName: "(chat)",
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
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

const PlatformProviders = Platform.select({
	web: (props: { children: React.ReactNode }) => (
		<HotkeyProvider>{props.children}</HotkeyProvider>
	),
	default: (props: { children: React.ReactNode }) => (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NativeHapticsProvider>{props.children}</NativeHapticsProvider>
		</GestureHandlerRootView>
	),
});

function RootLayoutNav() {
	return (
		<ThemeProvider>
			<QueryClientProvider>
				<PlatformProviders>
					<AppStateProvider>
						<Stack
							initialRouteName="(chat)"
							screenOptions={{ headerShown: false }}
						>
							<Stack.Screen name="(chat)" />
							<Stack.Screen
								name="file/[id]"
								options={{ presentation: "modal" }}
							/>
							<Stack.Screen
								name="agent/index"
								options={{ presentation: "modal" }}
							/>
							<Stack.Screen
								name="agent/[id]"
								options={{ presentation: "modal" }}
							/>
							<Stack.Screen name="agent/create/index" />
							<Stack.Screen
								name="settings"
								options={{ presentation: "modal" }}
							/>
						</Stack>
					</AppStateProvider>
					<PortalHost />
				</PlatformProviders>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export { ErrorBoundary } from "expo-router";
