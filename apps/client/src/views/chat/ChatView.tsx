import { View } from "react-native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

import { useChat } from "@/hooks/useChat";
import ChatHistory from "@/components/ChatHistory";
import { ChatInputContainer } from "@/components/ChatInput";
import { ChatHeader } from "./ChatHeader";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { Drawer } from "@/app/(app)/_layout";

export function ChatView({ threadId }: { threadId: string | null }) {
    const { loading, handleSubmit, abort } = useChat(threadId);
    return (
        <DrawerScreenWrapper>
            <Drawer.Screen
                options={{
                    header: (props: NativeStackHeaderProps) => (
                        <ChatHeader threadId={threadId} {...props} />
                    ),
                }}
            />
            {threadId ? (
                <ChatHistory isLoading={loading} threadId={threadId} />
            ) : (
                <ChatHistoryPlaceHolder />
            )}
            <ChatInputContainer
                threadId={threadId}
                handleSubmit={handleSubmit}
                abort={abort}
                loading={loading}
            />
        </DrawerScreenWrapper>
    );
}

function ChatHistoryPlaceHolder() {
    return <View className="flex-1"></View>;
}
