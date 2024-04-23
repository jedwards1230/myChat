import { View } from "react-native";
import Toast from "react-native-toast-message";

import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { useAgentToolQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { useAgentToolPatch } from "@/hooks/fetchers/AgentTool/useAgentToolPatch";

export function ToolCard({ agentId, toolId }: { agentId: string; toolId: string }) {
    const agentToolQuery = useAgentToolQuery(agentId, toolId);
    const agentToolEditMut = useAgentToolPatch();

    const agentTool = agentToolQuery.data;

    const onCheckedChange = async (checked: boolean) => {
        try {
            await agentToolEditMut.mutateAsync({
                agentId,
                toolId,
                agentToolConfig: { type: "enabled", value: !agentTool?.enabled },
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
                <Text className="text-xl font-medium">
                    {typeof agentTool?.name === "string" ? agentTool.name : "Tool Name"}
                </Text>
                <Switch
                    className="scale-75"
                    checked={agentTool?.enabled ? true : false}
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
