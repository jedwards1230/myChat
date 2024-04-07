import { useChat } from "@/lib/useChat";
import ChatHistory from "@/components/ChatHistory";
import { ChatHeader } from "./ChatHeader";
import { ChatViewWrapper } from "./ChatViewWrapper";
import { ChatInputContainer } from "./ChatInput";

export function ChatView({ threadId }: { threadId: string | null }) {
	const { loading, handleSubmit, abort } = useChat(threadId);
	return (
		<ChatViewWrapper>
			<ChatHeader />
			{threadId && <ChatHistory isLoading={loading} threadId={threadId} />}
			<ChatInputContainer
				threadId={threadId}
				handleSubmit={handleSubmit}
				abort={abort}
				loading={loading}
			/>
		</ChatViewWrapper>
	);
}
