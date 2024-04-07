import { ContextMenuView, type MenuConfig } from "react-native-ios-context-menu";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import type { Thread } from "@/types";
import { useAction } from "@/lib/actions";
import { Text } from "@/components/ui/Text";
import ChatHistory from "@/components/ChatHistory";

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
	const deleteThread = useAction("deleteThread");
	const router = useRouter();

	const goToThread = () => router.push({ pathname: `/(chat)/c/${thread.id}` });

	const onMenuAction = (actionKey: string) => {
		switch (actionKey) {
			case "delete":
				deleteThread.action(thread.id);
				break;
		}
	};

	return (
		<Pressable
			className="flex flex-row items-center justify-start w-full h-10 gap-2 p-2 rounded-md active:bg-primary group bg-secondary hover:bg-secondary-foreground/10 dark:hover:bg-secondary-foreground/50 active:opacity-90"
			onPress={goToThread}
			onLongPress={() => null}
			delayLongPress={125}
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
		<View className="absolute flex items-center w-[90vw] justify-start flex-1 px-2 pt-2 bg-background">
			<Text numberOfLines={1} ellipsizeMode="tail" className="my-1 font-semibold">
				{thread.title}
			</Text>
			<ChatHistory threadId={thread.id} isLoading={false} />
		</View>
	);
};
