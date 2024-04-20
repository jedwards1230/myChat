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

const DEBUG =
    process.env.EXPO_PUBLIC_DEBUG_QUERY === "true" &&
    process.env.NODE_ENV === "development";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
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
    mutationCache: new MutationCache({
        onError: (error) => {
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
    useEffect(() => {
        const subscription = AppState.addEventListener("change", onAppStateChange);
        return () => subscription.remove();
    }, []);

    return (
        <BaseProvider client={queryClient} persistOptions={{ persister }}>
            {props.children}
            {DEBUG && <DevToolsBubble />}
        </BaseProvider>
    );
}
