import { View } from "react-native";

import { BaseMessage } from "./Message/BaseMessage";
import type { ChatMessageGroup } from "./MessageGroup";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";
import { Avatar } from "./Avatar";

export function MessageGroupBubble({
    group,
    editMode,
    isLoading,
}: {
    group: ChatMessageGroup;
    editMode?: boolean;
    isLoading?: boolean;
}) {
    const role = group.role === "user" ? "user" : "assistant";
    const name = group.name || group.role;

    return (
        <View
            className={cn(
                "border p-2 rounded",
                editMode ? "bg-input/20 border-input" : "border-transparent"
            )}
        >
            <View className="flex flex-row items-center gap-2">
                <Avatar name={name} role={role} />
                <Text className="text-lg font-semibold md:font-bold">{group.name}</Text>
            </View>
            <View className={cn(editMode ? "pl-4" : "", "pt-1")}>
                {group.messages.map((message, idx) => (
                    <BaseMessage
                        key={message.id + idx}
                        message={message}
                        group={group}
                        isLoading={isLoading}
                    />
                ))}
            </View>
        </View>
    );
}
