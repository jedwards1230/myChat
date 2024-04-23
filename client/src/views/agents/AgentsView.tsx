import { View, Pressable } from "react-native";

import { Text } from "@/components/ui/Text";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";
import { Link } from "expo-router";
import { Agent } from "@/types";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";

export function AgentsView() {
    const { data: agents, isSuccess, error } = useAgentsQuery();

    if (!isSuccess) {
        if (error) console.error(error);
        return null;
    }
    return (
        <DrawerScreenWrapper>
            <View className="items-center flex-1 w-full gap-12 pt-24">
                <View>
                    <Text className="text-3xl font-semibold">Agents</Text>
                </View>
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
            <Pressable className="px-8 py-4 border rounded-lg border-input">
                <Text className="text-lg">{agent.name}</Text>
            </Pressable>
        </Link>
    );
}
