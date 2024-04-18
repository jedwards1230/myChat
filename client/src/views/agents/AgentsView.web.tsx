import { Keyboard, Pressable, View } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, ParamListBase, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Link } from "expo-router";

import { AntDesign, Entypo, Octicons } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";
import { Agent } from "@/types";
import { Button } from "@/components/ui/Button";
import { AgentDialog } from "../../components/Dialogs/AgentDialog.web";

export function AgentsView() {
	const { data, isSuccess, error } = useAgentsQuery();

	if (!isSuccess) {
		if (error) console.error(error);
	}
	const agents = data || [];
	return (
		<View className="relative flex flex-row flex-1 w-full bg-background">
			<CollapseDrawer />
			<View className="flex flex-col items-center w-full gap-12 pt-24">
				<View>
					<Text className="text-3xl font-semibold">Agents</Text>
				</View>
				<View className="w-1/2 mx-auto">
					{agents.length > 0 ? (
						agents.map((a, i) => <AgentButton key={a.id + i} agent={a} />)
					) : (
						<Text>No agents found</Text>
					)}
				</View>
			</View>
			<View className="absolute right-8 top-8">
				<NewAgentButton />
			</View>
		</View>
	);
}

function NewAgentButton() {
	return (
		<Link asChild href="/agent/create/">
			<Button size="icon" variant="outline">
				<AntDesign
					name="plus"
					size={28}
					className="transition-all text-foreground/40 group-hover:text-foreground/60 group-active:text-foreground/90"
				/>
			</Button>
		</Link>
	);
}

function AgentButton({ agent }: { agent: Agent }) {
	return (
		<AgentDialog existingAgent={agent}>
			<Pressable className="flex flex-row items-center justify-between w-full p-4 rounded-lg hover:bg-foreground/10">
				<View>
					<Text className="text-lg">{agent.name}</Text>
					<Text className="">Description</Text>
				</View>
				<View className="flex flex-row gap-4">
					<Link asChild href="/agent/create/">
						<Pressable className="p-1 rounded-full hover:bg-foreground/15">
							<Octicons name="pencil" size={18} />
						</Pressable>
					</Link>

					<Link asChild href="/agent/create/">
						<Pressable className="p-1 rounded-full hover:bg-foreground/15">
							<Octicons name="trash" size={18} />
						</Pressable>
					</Link>
				</View>
			</Pressable>
		</AgentDialog>
	);
}

function CollapseDrawer() {
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
	const isDrawerOpen = useDrawerStatus() === "open";

	return (
		<View className="absolute left-0 z-10 flex-row items-center justify-center hidden h-full md:flex">
			<Pressable
				android_ripple={{ borderless: true }}
				onPress={() => {
					navigation.dispatch(DrawerActions.toggleDrawer());
					Keyboard.dismiss();
				}}
				hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
			>
				<Entypo
					className="text-foreground hover:text-foreground/50 hover:scale-105"
					name={isDrawerOpen ? "chevron-small-left" : "chevron-small-right"}
					size={24}
				/>
			</Pressable>
		</View>
	);
}
