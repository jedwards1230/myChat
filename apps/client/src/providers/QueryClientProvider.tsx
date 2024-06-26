import {
	focusManager,
	MutationCache,
	onlineManager,
	QueryCache,
	QueryClient,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { useEffect } from "react";
import { DevToolsBubble } from "react-native-react-query-devtools";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider as BaseProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import Toast from "react-native-toast-message";

import { isFetchError } from "@/lib/fetcher";
import { useConfigStore } from "@/hooks/stores/configStore";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
			throwOnError: (error) => !isFetchError(error),
		},
	},
	queryCache: new QueryCache({
		onError: async (error, query) => {
			if (!isFetchError(error)) return;

			if (error.status) {
				if (error.status >= 500) {
					Toast.show({
						type: "error",
						text1: `Server Error ${error.status}`,
						text2: error.message,
					});
					console.log(`Query Error Code: ${error.status}`);
				} else if (error.status === 429) {
					Toast.show({
						type: "error",
						text1: "Rate Limit Exceeded",
						text2: "Retrrying in 1 minute.",
					});
					await queryClient.cancelQueries();
					setTimeout(() => {
						console.log(
							"Retrying query after rate limit",
							query.options.queryKey
						);
						queryClient.invalidateQueries();
					}, 1000 * 60);
				} else {
					Toast.show({
						type: "error",
						text1: error.name,
						text2: error.message,
					});
					await queryClient.cancelQueries();
					console.log("providerCache DEFAULT", { error, query });
					console.log(`Query Error Code: ${error.status}`);
					console.log(`Cancelled query: ${query.options.queryKey}`);
				}
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: async (error) => {
			if (!isFetchError(error)) return;
			if (error.status && error.status >= 500) {
				Toast.show({
					type: "error",
					text1: error.name,
					text2: error.message,
				});
			}
		},
	}),
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

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
	const debugQuery = useConfigStore.use.debugQuery();
	useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	return (
		<BaseProvider client={queryClient} persistOptions={{ persister }}>
			{props.children}
			{debugQuery && <DevToolsBubble />}
		</BaseProvider>
	);
}
