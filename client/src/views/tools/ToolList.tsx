import { ScrollView, Pressable, View } from "react-native";

import { useToolsQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { Agent, ToolName } from "@/types";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export function ToolList({
    agent,
    activeTool,
    setTool,
}: {
    agent: Agent;
    activeTool: ToolName | null;
    setTool: (tool: ToolName) => void;
}) {
    const { data, isPending, isError } = useToolsQuery();

    if (isError) return <Text>Error loading tools</Text>;
    if (isPending) return <Text>Loading...</Text>;
    return (
        <View className="px-1 border-r basis-1/4 border-input">
            <Text className="mb-1 text-sm font-medium">Available Tools</Text>
            <ScrollView contentContainerClassName="gap-y-1 flex">
                {data.map((t) => (
                    <ToolListItem
                        key={t}
                        tool={t}
                        onPress={() => setTool(t)}
                        active={activeTool === t}
                        agent={agent}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

export function ToolListItem({
    tool,
    active,
    onPress,
    agent,
}: {
    tool: ToolName;
    active: boolean;
    onPress: () => void;
    agent: Agent;
}) {
    return (
        <Pressable
            className="flex flex-row items-center justify-between px-1.5 py-1 rounded hover:bg-foreground/10 aria-disabled:bg-foreground/20 aria-selected:bg-primary aria-selected:text-background"
            disabled={!agent.toolsEnabled}
            aria-selected={active}
            onPress={onPress}
        >
            <Text
                aria-disabled={!agent.toolsEnabled}
                className="aria-disabled:text-foreground/50"
            >
                {tool}
            </Text>
            <View
                className={cn(
                    "p-1 m-1 mr-1 rounded-full",
                    agent.toolsEnabled
                        ? agent.tools?.includes({ toolName: tool })
                            ? "bg-green-500"
                            : "bg-red-500"
                        : "bg-gray-400"
                )}
            />
        </Pressable>
    );
}
