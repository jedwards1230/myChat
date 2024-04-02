import ChatHistory from "@/components/ChatHistory";
import { useChat } from "@/lib/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatViewWrapper } from "./ChatViewWrapper";
import { ChatInputContainer } from "./ChatInput";
import { useConfigStore } from "@/lib/stores/configStore";

export function ChatView() {
	const { loading, handleSubmit, abort } = useChat();
	const threadId = useConfigStore((state) => state.threadId);

	return (
		<ChatViewWrapper>
			<ChatHeader />
			{threadId && <ChatHistory isLoading={loading} threadId={threadId} />}
			<ChatInputContainer
				handleSubmit={handleSubmit}
				abort={abort}
				loading={loading}
			/>
		</ChatViewWrapper>
	);
}
