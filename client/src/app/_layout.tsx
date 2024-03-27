import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";

import "./global.css";

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

import { withNativeOnly } from "@/components/withNativeOnly";
import { PortalHost } from "@/components/primitives/portal";

export const unstable_settings = {
	initialRouteName: "(chat)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const NativeGestureHandlerRootView = withNativeOnly(GestureHandlerRootView);

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

function RootLayoutNav() {
	return (
		<ThemeProvider>
			<NativeGestureHandlerRootView style={{ flex: 1 }}>
				<QueryClientProvider>
					<NativeHapticsProvider>
						<HotkeyProvider>
							<AppStateProvider>
								<Stack
									initialRouteName="(chat)"
									screenOptions={{ headerShown: false }}
								>
									<Stack.Screen name="(chat)" />
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
										name="file/cache/[id]"
										options={{ presentation: "modal" }}
									/>
									<Stack.Screen
										name="settings"
										options={{ presentation: "modal" }}
									/>
								</Stack>
							</AppStateProvider>
							<PortalHost />
						</HotkeyProvider>
					</NativeHapticsProvider>
				</QueryClientProvider>
			</NativeGestureHandlerRootView>
		</ThemeProvider>
	);
}

export { ErrorBoundary } from "expo-router";
