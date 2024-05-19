import type { Agent } from "@/types";
import { Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Drawer } from "@/app/(app)/_layout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";
import { AgentDialog } from "@/views/agent/AgentDialog.web";

import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { HeaderWrapper } from "../HeaderWrapper";

export function AgentsView() {
	const { data, isSuccess, error } = useAgentsQuery();

	if (!isSuccess) {
		if (error) console.error(error);
	}
	const agents = data ?? [];
	return (
		<DrawerScreenWrapper>
			<Drawer.Screen options={{ header: () => <HeaderWrapper title="Agents" /> }} />
			<View className="flex w-full flex-col gap-4 p-2">
				<View className="flex-1">
					{agents.length > 0 ? (
						agents.map((a, i) => <AgentButton key={a.id + i} agent={a} />)
					) : (
						<Text>No agents found</Text>
					)}
				</View>
			</View>
			<View className="absolute right-4 top-4">
				<NewAgentButton />
			</View>
		</DrawerScreenWrapper>
	);
}

function NewAgentButton() {
	return (
		<Link asChild href="/agent/create/">
			<Button size="icon" variant="outline">
				<Icon
					type="AntDesign"
					name="plus"
					size={18}
					className="text-foreground/40 transition-all group-hover:text-foreground/60 group-active:text-foreground/90"
				/>
			</Button>
		</Link>
	);
}

function AgentButton({ agent }: { agent: Agent }) {
	return (
		<AgentDialog existingAgent={agent}>
			<Pressable className="flex w-full flex-row items-center justify-between rounded-lg px-4 py-2 hover:bg-foreground/10">
				<View>
					<Text className="text-lg">{agent.name}</Text>
					<Text>Description</Text>
				</View>
				<View className="flex flex-row gap-4">
					<Link asChild href="/agent/create/">
						<Pressable className="group">
							<Icon
								type="Octicons"
								className="text-foreground/60 group-hover:text-foreground"
								name="pencil"
								size={18}
							/>
						</Pressable>
					</Link>

					<Link asChild href="/agent/create/">
						<Pressable className="group">
							<Icon
								type="Octicons"
								className="text-foreground/60 group-hover:text-foreground"
								name="trash"
								size={18}
							/>
						</Pressable>
					</Link>
				</View>
			</Pressable>
		</AgentDialog>
	);
}
