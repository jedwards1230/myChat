import {
	ContextMenuView,
	type OnPressMenuItemEvent,
	type MenuConfig,
} from "react-native-ios-context-menu";
import { View } from "react-native";
import { useRouter } from "expo-router";

import type { Thread } from "@/types";
import { Text } from "@/components/ui/Text";
import ChatHistory from "@/components/ChatHistory";
import { useDeleteActiveThread } from "@/hooks/actions";
import LinkButton from "../LinkButton";

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
	const deleteThread = useDeleteActiveThread();
	const router = useRouter();

	const href = { pathname: `/(app)/`, params: { c: thread.id } } as const;

	const onPressMenuItem: OnPressMenuItemEvent = ({ nativeEvent }) => {
		switch (nativeEvent.actionKey) {
			case "delete":
				deleteThread.action(thread.id);
				break;
		}
	};

	return (
		<LinkButton isActive={({ threadId }) => threadId === thread.id} href={href}>
			<ContextMenuView
				menuConfig={menuConfig}
				onPressMenuItem={onPressMenuItem}
				onPressMenuPreview={() => router.push(href)}
				previewConfig={{ previewType: "CUSTOM" }}
				renderPreview={() => <ThreadPreview thread={thread} />}
			>
				<Text className="text-foreground" numberOfLines={1} ellipsizeMode="tail">
					{thread.title || "New chat"}
				</Text>
			</ContextMenuView>
		</LinkButton>
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
