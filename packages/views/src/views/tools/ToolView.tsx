import { Pressable, ScrollView, View } from "react-native";

import type { ToolName } from "@mychat/db/schema/tools/index.js";
import type { InferResultType } from "@mychat/db/types/utils.js";
import { api } from "@mychat/api/client/react-query";

import { Text } from "~/native/Text";
import { cn } from "~/utils";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { ToolDialog } from "./[id]/ToolDialog";

export function ToolView() {
	const { data, isPending, isError } = api.agent.getTools.useQuery();
	const userQuery = api.user.byId.useQuery({ id: "me" });

	if (isError) return <Text>Error loading tools</Text>;
	if (isPending) return <Text>Loading...</Text>;

	const { data: agent, ...agentQuery } = api.agent.byId.useQuery({
		id: userQuery.data?.defaultAgentId ?? "",
	});
	if (agentQuery.isError) return <Text>Error loading agent</Text>;
	if (agentQuery.isPending) return <Text>Loading agent...</Text>;
	if (!agent) return <Text>No agent found</Text>;
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

export function ToolListItem({
	tool,
	agent,
}: {
	tool: ToolName;
	agent: InferResultType<"Agent", { tools: true }>;
}) {
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
