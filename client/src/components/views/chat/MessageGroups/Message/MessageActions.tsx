import { ContextMenuView, type MenuConfig } from "react-native-ios-context-menu";
import * as Clipboard from "expo-clipboard";

import { useGroupStore } from "../GroupStore";
import { Message } from "@/types";
import { useDeleteMessageMutation } from "@/lib/mutations/useDeleteMessageMutation";
import { PreviewMessage } from "./PreviewMessage";

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
	groupId,
	children,
}: {
	message: Message;
	groupId: string;
	children?: React.ReactNode;
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

	return (
		<ContextMenuView
			menuConfig={menuConfig}
			renderPreview={() => <PreviewMessage message={message} />}
			previewConfig={{ previewType: "CUSTOM" }}
			onPressMenuItem={({ nativeEvent }) => onMenuAction(nativeEvent.actionKey)}
		>
			{children}
		</ContextMenuView>
	);
}
