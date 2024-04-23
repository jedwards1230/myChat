import { useState } from "react";
import { View } from "react-native";

import { Agent, ToolName } from "@/types";
import { ToolCard } from "./ToolCard";
import { ToolList } from "./ToolList";
import { useToolsQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { Text } from "@/components/ui/Text";

export function ToolsOverview({ agent }: { agent: Agent }) {
    const [activeTool, setTool] = useState<ToolName | null>(null);
    const { data, isPending, isError } = useToolsQuery();
    const tool = data?.find((t) => t === activeTool);

    if (isError) return <Text>Error loading tools</Text>;
    if (isPending) return <Text>Loading...</Text>;
    return (
        <>
            <View className="flex-1">
                <View className="flex flex-row flex-1 p-2 border rounded-lg border-input">
                    <ToolList agent={agent} setTool={setTool} activeTool={activeTool} />
                    <View className="flex-1 basis-3/4">
                        {tool && <ToolCard agentId={agent.id} toolId={tool} />}
                    </View>
                </View>
            </View>
        </>
    );
}
