import { useChat } from "@/hooks/useChat";
import ChatHistory from "@/components/ChatHistory";
import { ChatInputContainer } from "@/components/ChatInput";
import { ChatHeader } from "./ChatHeader";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";

export function ChatView({ threadId }: { threadId: string | null }) {
    const { loading, handleSubmit, abort } = useChat(threadId);
    return (
        <DrawerScreenWrapper>
            <ChatHeader threadId={threadId} />
            {threadId && <ChatHistory isLoading={loading} threadId={threadId} />}
            <ChatInputContainer
                threadId={threadId}
                handleSubmit={handleSubmit}
                abort={abort}
                loading={loading}
            />
        </DrawerScreenWrapper>
    );
}
