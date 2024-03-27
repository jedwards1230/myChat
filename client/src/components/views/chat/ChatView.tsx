import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";

import ChatHistory from "./ChatHistory";
import { useChat } from "@/lib/useChat";
import { ChatHeader } from "./ChatHeader";
import ChatInputContainer from "./ChatInput/ChatInputContainer";

export function ChatView() {
	const { loading, handleSubmit } = useChat();

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-background"
			>
				<SafeAreaView className="items-center justify-between flex-1 w-full">
					<ChatHeader />
					<ChatHistory isLoading={loading} />
					<ChatInputContainer handleSubmit={handleSubmit} />
				</SafeAreaView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
