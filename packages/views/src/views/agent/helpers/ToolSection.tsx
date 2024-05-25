import { useState } from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";

import type { ToolName } from "@mychat/db/schema/tools/index.js";
import type { InferResultType } from "@mychat/db/types";
import { api } from "@mychat/api/client/react-query";

import { Checkbox } from "~/native/Checkbox";
import { Section } from "~/native/Section";
import { Text } from "~/native/Text";
import { ToggleToolsSwitch } from "./ToggleTools";

type Agent = InferResultType<"Agent", { tools: true }>;

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
	const { data } = api.agent.getTools.useQuery();

	return data?.length ? (
		data.map((tool) => <ToolOption key={tool} agent={agent} toolName={tool} />)
	) : (
		<Text className="text-red-500">No tools Found</Text>
	);
}

export function ToolOption({ agent, toolName }: { agent: Agent; toolName: ToolName }) {
	const [open, setOpen] = useState(false);
	const agentEditMut = api.agent.edit.useMutation();

	const onCheckedChange = async (checked: boolean) => {
		try {
			const value = checked
				? [...(agent.tools ? agent.tools : []), { toolName }]
				: agent.tools?.filter((t) => t.toolName !== toolName);

			console.log(value);
			await agentEditMut.mutateAsync({
				id: agent.id,
				data: {
					// agentConfig: { type: "tools", value } as AgentUpdateSchema,
				},
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
