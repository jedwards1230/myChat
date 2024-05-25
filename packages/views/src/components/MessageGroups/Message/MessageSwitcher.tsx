import { Pressable, View } from "react-native";

import type { Message } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Icon } from "@mychat/ui/native/Icon";
import { Text } from "@mychat/ui/native/Text";
import { cn } from "@mychat/ui/utils";

import type { ChatMessageGroup } from "../MessageGroup";

export function MessageSwitcher({
	message,
	group,
}: {
	message: Message;
	group: ChatMessageGroup;
}) {
	const { mutate } = api.thread.edit.useMutation();
	const siblings = message.parentId ? group.siblings?.[message.parentId] ?? [] : [];
	const prev = siblings[siblings.indexOf(message.id) - 1];
	const next = siblings[siblings.indexOf(message.id) + 1];

	const switchMessage = (id?: string) =>
		id &&
		mutate({
			id: group.threadId,
			data: {
				//activeMessageId: id
			},
		});

	if (siblings.length <= 1) return null;
	return (
		<View className="flex flex-row items-center gap-1 pl-8 md:pl-0">
			<Pressable
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				onPress={() => switchMessage(prev)}
				disabled={!prev}
			>
				<Icon
					type="FontAwesome5"
					name="chevron-left"
					className={cn(
						"!text-sm group-aria-disabled:opacity-30",
						!prev && "opacity-30",
					)}
				/>
			</Pressable>
			<Text className="!text-sm">
				{siblings.indexOf(message.id) + 1} / {siblings.length}
			</Text>
			<Pressable onPress={() => switchMessage(next)} disabled={!next}>
				<Icon
					type="FontAwesome5"
					name="chevron-right"
					className={cn(
						"!text-sm group-aria-disabled:opacity-30",
						!next && "opacity-30",
					)}
				/>
			</Pressable>
		</View>
	);
}
