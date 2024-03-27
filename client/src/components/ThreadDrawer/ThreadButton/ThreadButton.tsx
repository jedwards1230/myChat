import { ContextMenuView, type MenuConfig } from "react-native-ios-context-menu";

import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import type { Thread } from "@/types";
import { Text } from "@/components/ui/Text";
import { useDeleteThreadMutation } from "@/lib/mutations/useDeleteThreadMutation";
import ChatHistory from "@/components/views/chat/ChatHistory";

const menuConfig: MenuConfig = {
	menuTitle: "",
	menuItems: [
		{
			actionKey: "delete",
			actionTitle: "Delete Thread",
		},
	],
};

export function ThreadButton({ thread }: { thread: Thread }) {
	const { mutate: deleteThread } = useDeleteThreadMutation(thread.id);
	const router = useRouter();

	const goToThread = () =>
		router.push({
			pathname: "/(chat)/",
			params: { c: thread.id },
		});

	const onMenuAction = (actionKey: string) => {
		switch (actionKey) {
			case "delete":
				deleteThread();
				break;
		}
	};

	return (
		<Pressable
			className="flex flex-row items-center justify-start w-full h-10 gap-2 p-2 rounded-md active:bg-primary group bg-secondary hover:bg-secondary-foreground/10 dark:hover:bg-secondary-foreground/50 active:opacity-90"
			onPress={goToThread}
			onLongPress={() => null}
			delayLongPress={66}
		>
			<ContextMenuView
				menuConfig={menuConfig}
				onPressMenuItem={({ nativeEvent }) => onMenuAction(nativeEvent.actionKey)}
				onPressMenuPreview={goToThread}
				previewConfig={{ previewType: "CUSTOM" }}
				renderPreview={() => <ThreadPreview thread={thread} />}
			>
				<Text className="text-foreground" numberOfLines={1} ellipsizeMode="tail">
					{thread.title}
				</Text>
			</ContextMenuView>
		</Pressable>
	);
}

const ThreadPreview = ({ thread }: { thread: Thread }) => {
	return (
		<View className="flex-1 w-[80vw] px-4 pt-2 bg-background">
			<Text
				numberOfLines={1}
				ellipsizeMode="tail"
				className="my-1 font-semibold text-center"
			>
				{thread.title}
			</Text>
			<ChatHistory threadIdOverride={thread.id} isLoading={false} />
		</View>
	);
};