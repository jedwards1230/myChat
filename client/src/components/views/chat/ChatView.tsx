import ChatHistory from "@/components/ChatHistory";
import { useChat } from "@/lib/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatViewWrapper } from "./ChatViewWrapper";
import { ChatInputContainer } from "./ChatInput";

export function ChatView() {
	const { loading, handleSubmit, abort } = useChat();

	return (
		<ChatViewWrapper>
			<ChatHeader />
			<ChatHistory isLoading={loading} />
			<ChatInputContainer
				handleSubmit={handleSubmit}
				abort={abort}
				loading={loading}
			/>
		</ChatViewWrapper>
	);
}
