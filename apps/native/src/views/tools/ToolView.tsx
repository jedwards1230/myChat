import type { Agent, ToolName } from "@/types";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { useToolsQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { useUserQuery } from "@/hooks/fetchers/User/useUserQuery";
import { cn } from "@/lib/utils";

import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { ToolDialog } from "./[id]/ToolDialog";

export function ToolView() {
	const { data, isPending, isError } = useToolsQuery();
	const userQuery = useUserQuery();

	if (isError) return <Text>Error loading tools</Text>;
	if (isPending) return <Text>Loading...</Text>;

	const agent = userQuery.data?.defaultAgent;
	if (!agent) return <Text>Error loading agent</Text>;
	return (
		<DrawerScreenWrapper>
			<View className="flex w-full flex-1 flex-col gap-4 p-4">
				<Text className="mb-1 text-sm font-medium">Available Tools</Text>
				<ScrollView
					className="w-full flex-1"
					contentContainerClassName="gap-y-1 flex-1 w-full"
				>
					{data.map((t) => (
						<ToolListItem key={t} tool={t} agent={agent} />
					))}
				</ScrollView>
			</View>
		</DrawerScreenWrapper>
	);
}

export function ToolListItem({ tool, agent }: { tool: ToolName; agent: Agent }) {
	return (
		<ToolDialog>
			<Pressable
				className="group flex flex-row items-center justify-between rounded px-1.5 py-1 hover:bg-foreground/10 aria-disabled:bg-foreground/20 aria-selected:bg-primary"
				disabled={!agent.toolsEnabled}
			>
				<Text className="group-aria-disabled:text-foreground/50 group-aria-selected:text-background">
					{tool}
				</Text>
				<View
					className={cn(
						"m-1 mr-1 rounded-full p-1",
						agent.toolsEnabled
							? agent.tools?.find((t) => t.toolName === tool)
								? "bg-green-500"
								: "bg-red-500"
							: "bg-gray-400",
					)}
				/>
			</Pressable>
		</ToolDialog>
	);
}
