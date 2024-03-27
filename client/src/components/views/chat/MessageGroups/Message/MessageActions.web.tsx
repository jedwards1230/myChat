import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { cn } from "@/lib/utils";
import { FontAwesome6, Octicons } from "@/components/ui/Icon";
import { Message } from "@/types";
import { useDeleteMessageMutation } from "@/lib/mutations/useDeleteMessageMutation";

export function MessageActions({
	message,
	groupId,
}: {
	message: Message;
	groupId: string;
}) {
	const { setEditId, reset, editMessageId } = useGroupStore();
	const { mutate: deleteMessage } = useDeleteMessageMutation(message.id);

	const editMode = editMessageId === message.id;

	const toggleEditMode = () => {
		editMode
			? reset()
			: setEditId({
					editGroupId: groupId,
					editMessageId: message.id,
			  });
	};

	const copyToClipboard = () => {
		if (message.content !== null) {
			Clipboard.setStringAsync(message.content);
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
		<View className="h-3 pl-6">
			<View
				className={cn(
					"flex-row gap-4 group-hover:flex",
					editMode ? "" : "hidden"
				)}
			>
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
	);
}
