import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { cn } from "@/lib/utils";
import { FontAwesome6, Octicons } from "@/components/ui/Icon";
import { Message } from "@/types";
import { useDeleteMessageMutation } from "@/hooks/fetchers/Message/useDeleteMessageMutation";
import { ChatMessageGroup } from "../MessageGroup";

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
	const { mutate: deleteMessage } = useDeleteMessageMutation(
		group.threadId,
		message.id
	);

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
			Clipboard.setStringAsync(message.content!);
		}
	};

	const actions = [
		{
			IconProvider: Octicons,
			icon: "pencil",
			onPress: toggleEditMode,
		},
		{
			IconProvider: FontAwesome6,
			icon: "clipboard",
			onPress: copyToClipboard,
			hidden: message.content === null,
		},
		{
			IconProvider: Octicons,
			icon: "trash",
			onPress: () => deleteMessage(),
		},
	];

	return (
		<>
			{children}
			{!editMode && (
				<View className="h-3 pl-6">
					<View className="flex-row hidden gap-4 group-hover:flex">
						{actions.map(({ IconProvider, icon, onPress, hidden }, i) =>
							!hidden ? (
								<Pressable
									className="transition-all active:scale-110"
									key={i}
									onPress={onPress}
								>
									<IconProvider
										name={icon}
										size={14}
										className="transition-colors text-foreground/30 hover:text-foreground/80"
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
