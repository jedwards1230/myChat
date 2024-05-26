import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View } from "react-native";

import ChatHistory from "../../components/ChatHistory";
import { ChatInputContainer } from "../../components/ChatInput";
import { useChat } from "../../hooks/useChat";
import { Drawer } from "../../navigators";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { ChatHeader } from "./ChatHeader";

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
