import { Pressable, View } from "react-native";
import * as ClipboardLib from "expo-clipboard";

import type { Message } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Clipboard, Pencil, Trash } from "@mychat/ui/svg";

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
			void ClipboardLib.setStringAsync(message.content);
		}
	};

	const actions = [
		{
			Icon: Pencil,
			onPress: toggleEditMode,
		} as const,
		{
			Icon: Clipboard,
			onPress: copyToClipboard,
			hidden: message.content === undefined,
		} as const,
		{
			Icon: Trash,
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
						{actions.map(({ Icon, onPress, hidden }, i) =>
							!hidden ? (
								<Pressable
									className="transition-all active:scale-110"
									key={i}
									onPress={onPress}
								>
									<Icon className="!text-sm text-foreground/30 hover:text-foreground/80" />
								</Pressable>
							) : null,
						)}
					</View>
				</View>
			)}
		</>
	);
}
