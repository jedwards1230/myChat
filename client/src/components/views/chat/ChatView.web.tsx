import { Keyboard, Pressable, View } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, ParamListBase, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import ChatHistory from "./ChatHistory";
import ChatInputContainer from "./ChatInput/ChatInputContainer";
import { useChat } from "@/lib/useChat";
import { ChatHeader } from "./ChatHeader";
import { Entypo } from "@/components/ui/Icon";

export function ChatView() {
	const { loading, handleSubmit } = useChat();

	return (
		<View className="flex flex-row flex-1 w-full bg-background">
			<CollapseDrawer />
			<View className="flex flex-col items-center justify-between w-full">
				<ChatHeader />
				<ChatHistory isLoading={loading} />
				<ChatInputContainer handleSubmit={handleSubmit} />
			</View>
		</View>
	);
}

function CollapseDrawer() {
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
	const isDrawerOpen = useDrawerStatus() === "open";

	return (
		<View className="absolute left-0 z-10 flex-row items-center justify-center hidden h-full md:flex">
			<Pressable
				android_ripple={{ borderless: true }}
				onPress={() => {
					navigation.dispatch(DrawerActions.toggleDrawer());
					Keyboard.dismiss();
				}}
				hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
			>
				<Entypo
					className="text-foreground hover:text-foreground/50 hover:scale-105"
					name={isDrawerOpen ? "chevron-small-left" : "chevron-small-right"}
					size={24}
				/>
			</Pressable>
		</View>
	);
}
