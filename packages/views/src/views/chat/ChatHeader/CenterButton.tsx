import type { MenuConfig } from "react-native-ios-context-menu";
import { Pressable } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useRouter } from "expo-router";

import { api } from "@mychat/api/client/react-query";
import { useTokenCount } from "@mychat/ui/hooks/useTokenCount";
import { Text } from "@mychat/ui/native/Text";
import { AngleDown } from "@mychat/ui/svg";

export function CenterButton({ threadId }: { threadId: string | null }) {
	const router = useRouter();
	const [user] = api.user.byId.useSuspenseQuery({ id: "me" });
	const defaultAgentId = user?.defaultAgentId;

	const { data: messages } = api.message.all.useQuery();
	// TODO: use threadQuery instead of agentQuery
	const { data: agent } = api.agent.byId.useQuery(
		{ id: defaultAgentId ?? "" },
		{ enabled: !!defaultAgentId },
	);
	const { mutateAsync: deleteThread } = api.thread.delete.useMutation();

	const tokenInput = messages?.map((m) => m.content).join(" ") ?? "";
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
				void deleteThread(threadId);
				break;
			case "agent":
				router.push(`/agent/${agent ? defaultAgentId : ""}`);
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
				<AngleDown />
			</Pressable>
		</ContextMenuButton>
	);
}
