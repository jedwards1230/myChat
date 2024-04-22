import { View } from "react-native";
import Toast from "react-native-toast-message";

import { Agent, AgentTool, AgentUpdateSchema, ToolName } from "@/types";
import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";

export function ToolCard({
    agent,
    toolName,
    tool,
}: {
    agent: Agent;
    toolName: ToolName;
    tool?: AgentTool;
}) {
    const agentEditMut = useAgentPatch();

    const onCheckedChange = async (checked: boolean) => {
        try {
            const value = checked
                ? [...(agent.tools ? agent.tools : []), { toolName }]
                : agent.tools?.filter((t) => t.toolName !== toolName);

            await agentEditMut.mutateAsync({
                agentId: agent.id,
                agentConfig: { type: "tools", value } as AgentUpdateSchema,
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
                <Text className="text-xl font-medium">{toolName}</Text>
                <Switch
                    className="scale-75"
                    checked={agent.tools?.includes({ toolName }) ?? false}
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
