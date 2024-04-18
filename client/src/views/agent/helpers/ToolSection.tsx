import { useState } from "react";

import { Agent } from "@/types";
import { useAgentEditMutation } from "@/hooks/fetchers/Agent/useAgentEditMutation";
import { useToolsQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { Section, RowItem } from "@/components/ui/Section";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";

export function ToolSection({ agent }: { agent: Agent }) {
	const { data } = useToolsQuery();
	const agentEditMut = useAgentEditMutation();

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
						<RowItem key={tool}>
							<Text>{tool}</Text>
						</RowItem>
					))
				) : (
					<Text className="text-red-500">No tools Found</Text>
				))}
		</Section>
	);
}
