import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import type { Message } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Icon } from "@mychat/ui/native/Icon";

import type { ChatMessageGroup } from "../MessageGroup";
import { useGroupStore } from "../GroupStore";
import { MessageSwitcher } from "./MessageSwitcher";

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
	const { mutate: deleteMessage } = api.message.delete.useMutation();

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
			void Clipboard.setStringAsync(message.content);
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
			hidden: message.content === undefined,
		} as const,
		{
			iconType: "FontAwesome6",
			icon: "trash",
			onPress: () => deleteMessage(message.id),
		} as const,
	];

	return (
		<>
			{children}
			{!editMode && (
				<View className="h-3 flex-row items-center gap-4 pl-6 pt-4">
					<MessageSwitcher message={message} group={group} />
					<View className="hidden flex-row items-center gap-4 group-hover:flex">
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
							) : null,
						)}
					</View>
				</View>
			)}
		</>
	);
}
