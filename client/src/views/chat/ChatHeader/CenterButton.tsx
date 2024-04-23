import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ContextMenuButton, type MenuConfig } from "react-native-ios-context-menu";

import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { useConfigStore } from "@/hooks/stores/configStore";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { useMessagesQuery } from "@/hooks/fetchers/Message/useMessagesQuery";
import { useTokenCount } from "@/hooks/useTokenCount";
import { useAction } from "@/hooks/useAction";

export function CenterButton({ threadId }: { threadId: string | null }) {
    const router = useRouter();
    const { defaultAgent } = useConfigStore();

    const { data: messages } = useMessagesQuery(threadId);
    const { data: agent } = useAgentQuery(defaultAgent.id);
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
                <Icon type="AntDesign" name="down" size={12} />
            </Pressable>
        </ContextMenuButton>
    );
}
