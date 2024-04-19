import { Agent, Tool } from "@/types";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";
import { useToolsQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { Section, RowItem } from "@/components/ui/Section";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { ToolOption } from "./ToolOption";

export function ToolSection({ agent }: { agent: Agent }) {
    const { data } = useToolsQuery();
    const agentEditMut = useAgentPatch();

    const onCheckedChange = async (checked: boolean) => {
        try {
            await agentEditMut.mutateAsync({
                agentId: agent.id,
                agentConfig: { type: "toolsEnabled", value: checked },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Section title="Tools">
            <RowItem>
                <Text>Enabled</Text>
                <Switch
                    checked={agent.toolsEnabled}
                    onCheckedChange={onCheckedChange}
                    nativeID="airplane-mode"
                />
            </RowItem>
            {agent.toolsEnabled &&
                (data && data.length ? (
                    data.map((tool) => (
                        <ToolFilter key={tool} agent={agent} tool={tool} />
                    ))
                ) : (
                    <Text className="text-red-500">No tools Found</Text>
                ))}
        </Section>
    );
}

function ToolFilter({ agent, tool }: { agent: Agent; tool: Tool }) {
    switch (tool) {
        case "Browser":
            return <ToolOption agent={agent} tool={tool} />;
    }
}
