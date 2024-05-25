import type { MenuConfig } from "react-native-ios-context-menu";
import { ContextMenuView } from "react-native-ios-context-menu";
import * as Clipboard from "expo-clipboard";

import type { InferResultType } from "@mychat/db/types";
import { api } from "@mychat/api/client/react-query";

import type { ChatMessageGroup } from "../MessageGroup";
import { useGroupStore } from "../GroupStore";
import { MessagePreview } from "./MessagePreview";
import { MessageSwitcher } from "./MessageSwitcher";

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
	message: InferResultType<"Message", { files: true }>;
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
		if (message.content) {
			void Clipboard.setStringAsync(message.content);
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
				deleteMessage(message.id);
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
			<MessageSwitcher message={message} group={group} />
		</ContextMenuView>
	);
}
