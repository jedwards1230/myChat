import type { MenuConfig, OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { View } from "react-native";
import { ContextMenuView } from "react-native-ios-context-menu";
import { useRouter } from "expo-router";

import type { Thread } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Text } from "@mychat/ui/native/Text";

import ChatHistory from "../../ChatHistory";
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
	const { mutateAsync: deleteThread } = api.thread.delete.useMutation();

	const router = useRouter();

	const href = { pathname: `/(app)/`, params: { c: thread.id } } as const;

	const onPressMenuItem: OnPressMenuItemEvent = ({ nativeEvent }) => {
		switch (nativeEvent.actionKey) {
			case "delete":
				void deleteThread(thread.id);
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
					{thread.title ?? "New chat"}
				</Text>
			</ContextMenuView>
		</LinkButton>
	);
}

const ThreadPreview = ({ thread }: { thread: Thread }) => {
	return (
		<View className="absolute flex w-[90vw] flex-1 items-center justify-start bg-background px-2 pt-2">
			<Text numberOfLines={1} ellipsizeMode="tail" className="my-1 font-semibold">
				{thread.title}
			</Text>
			<ChatHistory threadId={thread.id} isLoading={false} />
		</View>
	);
};