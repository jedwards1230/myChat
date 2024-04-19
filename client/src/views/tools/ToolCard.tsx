import { View } from "react-native";

import { Agent, Tool } from "@/types";
import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";
import Toast from "react-native-toast-message";

export function ToolCard({ agent, tool }: { agent: Agent; tool: Tool }) {
    const agentEditMut = useAgentPatch();

    const onCheckedChange = async (checked: boolean) => {
        try {
            const value = checked
                ? [...agent.tools, tool]
                : agent.tools.filter((t) => t !== tool);

            await agentEditMut.mutateAsync({
                agentId: agent.id,
                agentConfig: { type: "tools", value },
            });
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "message" in error ? error.message : "An error occurred",
            });
        }
    };

    return (
        <View className="gap-2 p-2 border rounded-lg border-border">
            <View>
                <Text className="text-xl font-medium">{tool}</Text>
                <Switch
                    className="scale-75"
                    checked={agent.tools.includes(tool)}
                    onCheckedChange={onCheckedChange}
                />
            </View>
            <ToolOverview />
        </View>
    );
}

export function ToolOverview() {
    return <Text>Tool Overview</Text>;
}
