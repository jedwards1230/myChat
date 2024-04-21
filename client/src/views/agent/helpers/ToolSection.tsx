import { useState } from "react";
import { Pressable, View } from "react-native";

import { Agent, Tool } from "@/types";
import { useToolsQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Checkbox } from "@/components/ui/Checkboz";
import { ToolDialog } from "@/views/tools/ToolDialog.web";
import { ToggleToolsSwitch } from "./ToggleTools";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";
import Toast from "react-native-toast-message";

export function ToolSection({ agent }: { agent: Agent }) {
    return (
        <Section
            title="Tools"
            titleComponent={
                <View className="flex flex-row items-center justify-between flex-1">
                    <View className="flex flex-row items-center">
                        <ToggleToolsSwitch agent={agent} />
                    </View>
                    <ToolDialog agent={agent}>
                        <Pressable className="group">
                            <Text className="text-xs text-foreground/50 group-hover:text-foreground">
                                Configure
                            </Text>
                        </Pressable>
                    </ToolDialog>
                </View>
            }
        >
            {agent.toolsEnabled ? (
                <ToolList agent={agent} />
            ) : (
                <Text className="text-sm">Tools are disabled</Text>
            )}
        </Section>
    );
}

function ToolList({ agent }: { agent: Agent }) {
    const { data } = useToolsQuery();

    return data && data.length ? (
        data.map((tool) => <ToolOption key={tool} agent={agent} tool={tool} />)
    ) : (
        <Text className="text-red-500">No tools Found</Text>
    );
}

export function ToolOption({ agent, tool }: { agent: Agent; tool: Tool }) {
    const [open, setOpen] = useState(false);
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
        <Pressable
            className="px-1.5 py-1 bg-background flex flex-row items-center gap-2 rounded hover:bg-foreground/5"
            onPress={() => setOpen(!open)}
        >
            <Checkbox
                checked={agent.tools.includes(tool)}
                onCheckedChange={onCheckedChange}
            />
            <Text className="text-sm">{tool}</Text>
        </Pressable>
    );
}
