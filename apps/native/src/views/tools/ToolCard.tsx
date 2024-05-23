import type { AgentTool } from "@/types";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useAgentToolPatch } from "@/hooks/fetchers/AgentTool/useAgentToolPatch";
import { useAgentToolQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";

import { Switch } from "@mychat/ui/native/Switch";
import { Text } from "@mychat/ui/native/Text";

export function ToolCard({ agentId, toolId }: { agentId: string; toolId: string }) {
	const agentToolQuery = useAgentToolQuery(agentId, toolId);
	const agentToolEditMut = useAgentToolPatch();

	const agentTool = agentToolQuery.data;

	const onCheckedChange = async (checked: boolean) => {
		try {
			await agentToolEditMut.mutateAsync({
				agentId,
				toolId,
				agentToolConfig: { type: "enabled", value: checked },
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
		<View className="gap-2 rounded-lg border border-border p-2">
			<View className="flex flex-row items-center gap-1">
				<Text className="text-xl font-medium">
					{typeof agentTool?.name === "string"
						? agentTool.name
						: typeof agentTool?.toolName === "string"
							? agentTool.toolName
							: "No Name"}
				</Text>
				<Switch
					className="scale-75"
					checked={agentTool?.enabled ? true : false}
					onCheckedChange={onCheckedChange}
				/>
			</View>
			{agentTool && <ToolOverview tool={agentTool} />}
		</View>
	);
}

export function ToolOverview({ tool }: { tool: AgentTool }) {
	return (
		<>
			<Text>Tool Overview</Text>
			<Text>
				{typeof tool.description === "string"
					? tool.description
					: "No Description"}
			</Text>
		</>
	);
}
