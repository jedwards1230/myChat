import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { Icon } from "@/components/ui/Icon";
import type { Message } from "@/types";
import { useMessageDelete } from "@/hooks/fetchers/Message/useMessageDelete";
import type { ChatMessageGroup } from "../MessageGroup";

export function MessageActions({
    message,
    group,
    children,
}: {
    message: Message;
    group: ChatMessageGroup;
    children?: React.ReactNode;
}) {
    const { setEditId, reset, editMessageId } = useGroupStore();
    const { mutate: deleteMessage } = useMessageDelete(group.threadId, message.id);

    const editMode = editMessageId === message.id;

    const toggleEditMode = () =>
        editMode
            ? reset()
            : setEditId({
                  editGroupId: group.id,
                  editMessageId: message.id,
              });

    const copyToClipboard = () => {
        if (typeof message.content === "string") {
            Clipboard.setStringAsync(message.content);
        }
    };

    const actions = [
        {
            iconType: "FontAwesome6",
            icon: "pencil",
            onPress: toggleEditMode,
        } as const,
        {
            iconType: "FontAwesome6",
            icon: "clipboard",
            onPress: copyToClipboard,
            hidden: message.content === null,
        } as const,
        {
            iconType: "FontAwesome6",
            icon: "trash",
            onPress: () => deleteMessage(),
        } as const,
    ];

    return (
        <>
            {children}
            {!editMode && (
                <View className="h-3 pl-6">
                    <View className="flex-row hidden gap-4 group-hover:flex">
                        {actions.map(({ icon, iconType, onPress, hidden }, i) =>
                            !hidden ? (
                                <Pressable
                                    className="transition-all active:scale-110"
                                    key={i}
                                    onPress={onPress}
                                >
                                    <Icon
                                        type={iconType}
                                        name={icon}
                                        size={14}
                                        className="text-foreground/30 hover:text-foreground/80"
                                    />
                                </Pressable>
                            ) : null
                        )}
                    </View>
                </View>
            )}
        </>
    );
}
