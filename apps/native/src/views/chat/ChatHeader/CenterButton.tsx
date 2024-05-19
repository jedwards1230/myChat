import type { MenuConfig } from "react-native-ios-context-menu";
import { Pressable } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { useDeleteActiveThread } from "@/hooks/actions";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { useMessagesQuery } from "@/hooks/fetchers/Message/useMessagesQuery";
import { useUserSuspenseQuery } from "@/hooks/fetchers/User/useUserQuery";
import { useTokenCount } from "@/hooks/useTokenCount";

export function CenterButton({ threadId }: { threadId: string | null }) {
	const router = useRouter();
	const {
		data: { defaultAgent },
	} = useUserSuspenseQuery();

	const { data: messages } = useMessagesQuery(threadId);
	// TODO: use threadQuery instead of agentQuery
	const { data: agent } = useAgentQuery(defaultAgent.id);
	const deleteThread = useDeleteActiveThread();

	const tokenInput = messages.map((m) => m.content).join(" ") || "";
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
				menuAttributes: threadId ? undefined : ["hidden"],
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
				if (!threadId) return;
				void deleteThread.action(threadId);
				break;
			case "agent":
				router.push(`/agent/${agent ? defaultAgent.id : ""}`);
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
				<Icon type="AntDesign" name="down" size={12} />
			</Pressable>
		</ContextMenuButton>
	);
}
