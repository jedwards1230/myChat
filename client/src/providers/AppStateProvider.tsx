"use client";

import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";
import { useEffect } from "react";

import ConnectHostDialog from "@/components/Dialogs/ConnectHost";
import { useUserQuery } from "@/lib/queries/useUserQuery";
import { FetchError } from "@/lib/utils";
import { useConfigStore } from "@/lib/stores/configStore";
import { Text } from "@/components/ui/Text";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const { setThreadId } = useConfigStore();
	const search = useGlobalSearchParams();
	const threadId = typeof search.c === "string" ? search.c : null;
	useEffect(() => setThreadId(threadId), [threadId]);

	return <AuthProvider>{children}</AuthProvider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const setUser = useConfigStore((state) => state.setUser);
	const { data, isPending, isError, error, ...rest } = useUserQuery();
	useEffect(() => {
		if (data && !isError) setUser(data);
	}, [data]);

	if (isPending) return null;
	if (isError) {
		return (
			<View className="h-full p-8">
				<Text>Something went wrong fetching the User</Text>
				<Text>Data: {JSON.stringify(data, null, 2)}</Text>
				<Text>Rest: {JSON.stringify(rest, null, 2)}</Text>
				<Text>{error.message}</Text>
			</View>
		);
		/* if (error instanceof FetchError) {
			if (error.res.status === 401) return <ConnectHostDialog />;
			if (error.res.status === 404) return <ConnectHostDialog />;
		} else if (error.message === "Network request failed") {
			console.log("Network request failed");
			return <ConnectHostDialog />;
		}

		return (
			<View className="h-full p-8">
				<Text>Something went wrong fetching the User</Text>
				<Text>{JSON.stringify(error, null, 2)}</Text>
			</View>
		); */
	}
	return children;
}