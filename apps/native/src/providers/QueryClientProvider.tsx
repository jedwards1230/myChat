import type { AppStateStatus } from "react-native";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { DevToolsBubble } from "react-native-react-query-devtools";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
	focusManager,
	MutationCache,
	onlineManager,
	QueryCache,
	QueryClient,
} from "@tanstack/react-query";
import { PersistQueryClientProvider as BaseProvider } from "@tanstack/react-query-persist-client";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { api } from "@mychat/api/client/react-query";
import { isFetchError } from "@mychat/api/fetcher";
import { useConfigStore } from "@mychat/ui/uiStore";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
	/**
	 * Gets the IP address of your host-machine. If it cannot automatically find it,
	 * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
	 * you don't have anything else running on it, or you'd have to change it.
	 *
	 * **NOTE**: This is only for development. In production, you'll want to set the
	 * baseUrl to your production API URL.
	 */
	const debuggerHost = Constants.expoConfig?.hostUri;
	const localhost = debuggerHost?.split(":")[0];

	if (!localhost) {
		// return "https://example.com";
		throw new Error(
			"Failed to get localhost. Please point to your production server.",
		);
	}
	return `http://${localhost}:3000`;
};

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
							query.options.queryKey,
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
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
					colorMode: "ansi",
				}),
				httpBatchLink({
					transformer: superjson,
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						const headers = new Map<string, string>();
						headers.set("x-trpc-source", "expo-react");
						return Object.fromEntries(headers);
					},
				}),
			],
		}),
	);

	const debugQuery = useConfigStore.use.debugQuery();
	useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<BaseProvider client={queryClient} persistOptions={{ persister }}>
				{props.children}
				{debugQuery && <DevToolsBubble />}
			</BaseProvider>
		</api.Provider>
	);
}
