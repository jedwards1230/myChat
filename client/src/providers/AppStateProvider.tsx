"use client";

import { View } from "react-native";
import { useEffect } from "react";

import { useUserQuery } from "@/lib/queries/useUserQuery";
import { useConfigStore } from "@/lib/stores/configStore";
import { Text } from "@/components/ui/Text";
import { useAgentStore } from "@/lib/stores/modelStore";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	return <AuthProvider>{children}</AuthProvider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const setUser = useConfigStore((state) => state.setUser);
	const setAgent = useAgentStore((state) => state.setAgent);

	const { data, isPending, isError, error, ...rest } = useUserQuery();
	useEffect(() => {
		if (data && !isError) {
			setUser(data);
			setAgent(data.defaultAgent);
		}
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
