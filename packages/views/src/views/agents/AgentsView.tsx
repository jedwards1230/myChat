import { Pressable, View } from "react-native";
import { Link } from "expo-router";

import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Text } from "@mychat/ui/native/Text";

import { Drawer } from "../../navigators";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";

export function AgentsView() {
	const { data: agents, isSuccess, error } = api.agent.all.useQuery();

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
