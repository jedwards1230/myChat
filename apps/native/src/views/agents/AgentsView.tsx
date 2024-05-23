import type { Agent } from "@/types";
import { Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Drawer } from "@/app/(app)/_layout";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";

import { Text } from "@mychat/ui/native/Text";

import { DrawerScreenWrapper } from "../DrawerScreenWrapper";

export function AgentsView() {
	const { data: agents, isSuccess, error } = useAgentsQuery();

	if (!isSuccess) {
		if (error) console.error(error);
		return null;
	}
	return (
		<DrawerScreenWrapper>
			<Drawer.Screen options={{ headerTitle: "Agents" }} />
			<View className="w-full flex-1 items-center gap-12 pt-24">
				<View className="">
					{agents.length > 0 ? (
						agents.map((a) => <AgentButton agent={a} key={a.id} />)
					) : (
						<Text>No agents found</Text>
					)}
				</View>
			</View>
		</DrawerScreenWrapper>
	);
}

function AgentButton({ agent }: { agent: Agent }) {
	return (
		<Link asChild href={`/agent/${agent.id}`}>
			<Pressable className="rounded-lg border border-input px-8 py-4">
				<Text className="text-lg">{agent.name}</Text>
			</Pressable>
		</Link>
	);
}
