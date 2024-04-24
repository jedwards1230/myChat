import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { useUserQuery } from "@/hooks/fetchers/User/useUserQuery";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { useToolsQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { Agent, ToolName } from "@/types";
import { cn } from "@/lib/utils";
import { ToolDialog } from "./[id]/ToolDialog";

export function ToolView() {
	const { data, isPending, isError } = useToolsQuery();
	const userQuery = useUserQuery();

	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	const agent = userQuery.data?.defaultAgent!;

	if (isError) return <Text>Error loading tools</Text>;
	if (isPending) return <Text>Loading...</Text>;
	return (
		<DrawerScreenWrapper>
			<View className="flex flex-col flex-1 w-full gap-4 p-4">
				<Text className="mb-1 text-sm font-medium">Available Tools</Text>
				<ScrollView
					className="flex-1 w-full"
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
				className="flex group flex-row items-center justify-between px-1.5 py-1 rounded hover:bg-foreground/10 aria-disabled:bg-foreground/20 aria-selected:bg-primary"
				disabled={!agent.toolsEnabled}
			>
				<Text className="group-aria-disabled:text-foreground/50 group-aria-selected:text-background">
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
		</ToolDialog>
	);
}
