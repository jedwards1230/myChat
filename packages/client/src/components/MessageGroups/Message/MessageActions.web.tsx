import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import type { Message } from "@/types";
import { useMessageDelete } from "@/hooks/fetchers/Message/useMessageDelete";
import type { ChatMessageGroup } from "../MessageGroup";
import { useThreadPatch } from "@/hooks/fetchers/Thread/useThreadPatch";

export function MessageActions({
	message,
	group,
	children,
}: {
	message: Message;
	group: ChatMessageGroup;
	children?: React.ReactNode;
}) {
	const { setEditId, reset, editMessageId } = useGroupStore();
	const { mutate: deleteMessage } = useMessageDelete(group.threadId, message.id);

	const editMode = editMessageId === message.id;

	const toggleEditMode = () =>
		editMode
			? reset()
			: setEditId({
					editGroupId: group.id,
					editMessageId: message.id,
				});

	const copyToClipboard = () => {
		if (typeof message.content === "string") {
			Clipboard.setStringAsync(message.content);
		}
	};

	const actions = [
		{
			iconType: "FontAwesome6",
			icon: "pencil",
			onPress: toggleEditMode,
		} as const,
		{
			iconType: "FontAwesome6",
			icon: "clipboard",
			onPress: copyToClipboard,
			hidden: message.content === null,
		} as const,
		{
			iconType: "FontAwesome6",
			icon: "trash",
			onPress: () => deleteMessage(),
		} as const,
	];

	return (
		<>
			{children}
			{!editMode && (
				<View className="h-3 pl-6">
					<View className="flex-row items-center hidden gap-4 group-hover:flex">
						<MessageSwitcher message={message} group={group} />
						{actions.map(({ icon, iconType, onPress, hidden }, i) =>
							!hidden ? (
								<Pressable
									className="transition-all active:scale-110"
									key={i}
									onPress={onPress}
								>
									<Icon
										type={iconType}
										name={icon}
										className="!text-sm text-foreground/30 hover:text-foreground/80"
									/>
								</Pressable>
							) : null
						)}
					</View>
				</View>
			)}
		</>
	);
}

function MessageSwitcher({
	message,
	group,
}: {
	message: Message;
	group: ChatMessageGroup;
}) {
	const { mutate } = useThreadPatch();
	const siblings = message.parent ? group.siblings?.[message.parent] ?? [] : [];
	const prev = siblings[siblings.indexOf(message.id) - 1];
	const next = siblings[siblings.indexOf(message.id) + 1];

	const switchMessage = (id?: string) =>
		id &&
		mutate({
			threadId: group.threadId,
			activeMessage: id,
		});

	if (siblings.length <= 1) return null;
	return (
		<View className="flex flex-row items-center gap-1">
			<Pressable
				onPress={() => switchMessage(prev)}
				disabled={!prev}
				className="aria-disabled:opacity-30"
			>
				<Icon type="FontAwesome5" name="chevron-left" className="!text-sm" />
			</Pressable>
			<Text className="!text-sm">
				{siblings.indexOf(message.id) + 1} / {siblings.length}
			</Text>
			<Pressable
				onPress={() => switchMessage(next)}
				disabled={!next}
				className="aria-disabled:opacity-30"
			>
				<Icon type="FontAwesome5" name="chevron-right" className="!text-sm" />
			</Pressable>
		</View>
	);
}
