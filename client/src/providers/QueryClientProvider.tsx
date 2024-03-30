import {
	focusManager,
	onlineManager,
	QueryClient,
	QueryClientProvider as BaseProvider,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { useEffect } from "react";
import { DevToolsBubble } from "react-native-react-query-devtools";

const DEBUG =
	process.env.EXPO_PUBLIC_DEBUG_QUERY === "true" &&
	process.env.NODE_ENV === "development";

const queryClient = new QueryClient();

// Set up the React Query online manager to use NetInfo.
onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected);
	});
});

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

export function QueryClientProvider(props: { children: React.ReactNode }) {
	useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	return (
		<BaseProvider client={queryClient}>
			{props.children}
			{DEBUG && <DevToolsBubble />}
		</BaseProvider>
	);
}
