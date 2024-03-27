import { Link, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { ContextMenuButton, type MenuConfig } from "react-native-ios-context-menu";

import { Text } from "@/components/ui/Text";
import { AntDesign } from "@/components/ui/Icon";
import { useDeleteThreadMutation } from "@/lib/mutations/useDeleteThreadMutation";
import { useConfigStore } from "@/lib/stores/configStore";
import { useAgentQuery } from "@/lib/queries/useAgentQuery";

const menuConfig: MenuConfig = {
	menuTitle: "",
	menuItems: [
		{
			actionKey: "delete",
			actionTitle: "Delete Thread",
		},
		{
			actionKey: "agent",
			actionTitle: "Agent",
		},
	],
};

export default function CenterButton() {
	const { threadId, user } = useConfigStore();
	const { data: agent } = useAgentQuery(user.defaultAgent.id);
	const { mutate: deleteThread } = useDeleteThreadMutation(threadId);
	const router = useRouter();

	const onMenuAction = (actionKey: string) => {
		switch (actionKey) {
			case "delete":
				deleteThread();
				break;
			case "agent":
				router.push({
					pathname: "/agent/",
					...(agent && { params: { id: agent.id } }),
				});
				break;
		}
	};

	return (
		<ContextMenuButton
			menuConfig={menuConfig}
			onPressMenuItem={({ nativeEvent }) => onMenuAction(nativeEvent.actionKey)}
		>
			<Pressable className="flex flex-row items-center gap-1">
				<Text
					className="text-lg font-semibold"
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					myChat
				</Text>
				<AntDesign name="down" size={12} className="text-foreground" />
			</Pressable>
		</ContextMenuButton>
	);
	return (
		<View className="items-center flex-1 w-full mx-auto">
			<Link asChild href="/agent/">
				<Pressable className="flex flex-row items-center gap-1">
					<Text
						className="text-lg font-semibold"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						myChat
					</Text>
					<AntDesign name="down" size={12} className="text-foreground" />
				</Pressable>
			</Link>
		</View>
	);
}
