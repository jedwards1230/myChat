import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ContextMenuButton, type MenuConfig } from "react-native-ios-context-menu";

import { Text } from "@/components/ui/Text";
import { AntDesign } from "@/components/ui/Icon";
import { useConfigStore } from "@/hooks/stores/configStore";
import { useAgentQuery } from "@/hooks/queries/useAgentQuery";
import { useMessagesQuery } from "@/hooks/queries/useMessagesQuery";
import { useTokenCount } from "@/hooks/useTokenCount";
import { useAction } from "@/hooks/useAction";

export default function CenterButton() {
	const router = useRouter();
	const { threadId, user } = useConfigStore();

	const { data: messages } = useMessagesQuery(threadId);
	const { data: agent } = useAgentQuery(user.defaultAgent.id);
	const deleteThread = useAction("deleteThread")();

	const tokenInput = messages?.map((m) => m.content).join(" ") || "";
	const tokens = useTokenCount(tokenInput);

	const menuConfig: MenuConfig = {
		menuTitle: "",
		menuItems: [
			{
				actionKey: "tokens",
				actionTitle: `Tokens: ${tokens}`,
			},
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

	const onMenuAction = (actionKey: string) => {
		switch (actionKey) {
			case "delete":
				deleteThread.action(threadId!);
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
}
