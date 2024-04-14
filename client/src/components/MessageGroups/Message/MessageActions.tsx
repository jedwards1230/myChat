import { ContextMenuView, type MenuConfig } from "react-native-ios-context-menu";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { Message } from "@/types";
import { useDeleteMessageMutation } from "@/hooks/mutations/useDeleteMessageMutation";
import { MessagePreview } from "./MessagePreview";
import { ChatMessageGroup } from "../MessageGroup";

const menuConfig: MenuConfig = {
	menuTitle: "",
	menuItems: [
		{
			actionKey: "edit",
			actionTitle: "Edit message",
		},
		{
			actionKey: "copy",
			actionTitle: "Copy message",
		},
		{
			actionKey: "delete",
			actionTitle: "Delete message",
		},
	],
};

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
		if (message.content) {
			Clipboard.setStringAsync(message.content);
		}
	};

	const onMenuAction = (actionKey: string) => {
		switch (actionKey) {
			case "edit":
				toggleEditMode();
				break;
			case "copy":
				copyToClipboard();
				break;
			case "delete":
				deleteMessage();
				break;
		}
	};

	if (editMode) return children;
	return (
		<ContextMenuView
			menuConfig={menuConfig}
			shouldPreventLongPressGestureFromPropagating={true}
			renderPreview={() => (
				<MessagePreview threadId={group.threadId} message={message} />
			)}
			previewConfig={{ previewType: "CUSTOM" }}
			onPressMenuItem={({ nativeEvent }) => onMenuAction(nativeEvent.actionKey)}
		>
			{children}
		</ContextMenuView>
	);
}
