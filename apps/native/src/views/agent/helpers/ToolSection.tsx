import type { Agent, AgentUpdateSchema, ToolName } from "@/types";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";
import { useToolsQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";

import { Checkbox } from "@mychat/ui/native/Checkbox";
import { Section } from "@mychat/ui/native/Section";
import { Text } from "@mychat/ui/native/Text";

import { ToggleToolsSwitch } from "./ToggleTools";

export function ToolSection({ agent }: { agent: Agent }) {
	return (
		<Section
			title="Tools"
			titleComponent={
				<View className="flex flex-1 flex-row items-center justify-between">
					<View className="flex flex-row items-center">
						<ToggleToolsSwitch agent={agent} />
					</View>
					<Pressable className="group">
						<Text className="text-xs text-foreground/50 group-hover:text-foreground">
							Configure (TODO)
						</Text>
					</Pressable>
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

	return data?.length ? (
		data.map((tool) => <ToolOption key={tool} agent={agent} toolName={tool} />)
	) : (
		<Text className="text-red-500">No tools Found</Text>
	);
}

export function ToolOption({ agent, toolName }: { agent: Agent; toolName: ToolName }) {
	const [open, setOpen] = useState(false);
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
		<Pressable
			className="flex flex-row items-center gap-2 rounded bg-background px-1.5 py-1 hover:bg-foreground/5"
			onPress={() => setOpen(!open)}
		>
			<Checkbox
				checked={agent.tools?.find((t) => t.toolName === toolName) ? true : false}
				onCheckedChange={onCheckedChange}
			/>
			<Text className="text-sm">{toolName}</Text>
		</Pressable>
	);
}
