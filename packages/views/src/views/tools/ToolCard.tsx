import { View } from "react-native";

import type { InferResultType } from "@mychat/db/types/utils.js";
import { api } from "@mychat/api/client/react-query";
import { Switch } from "@mychat/ui/native/Switch";
import { Text } from "@mychat/ui/native/Text";
import Toast from "@mychat/ui/providers/ToastProvider";

type AgentTool = InferResultType<"AgentTool">;

export function ToolCard({ agentId, toolId }: { agentId: string; toolId: string }) {
	const agentToolQuery = api.agentTool.byId.useQuery({ id: agentId });
	const agentToolEditMut = api.agentTool.edit.useMutation();

	const agentTool = agentToolQuery.data;

	const onCheckedChange = async (checked: boolean) => {
		try {
			console.log(checked, toolId);
			await agentToolEditMut.mutateAsync({
				id: toolId,
				data: {
					enabled: checked,
					//agentToolConfig: { type: "enabled", value: checked } },
				} as any,
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
						: typeof agentTool?.name === "string"
							? agentTool.name
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
