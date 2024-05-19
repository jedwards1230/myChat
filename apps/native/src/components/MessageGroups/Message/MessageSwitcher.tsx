import type { Message } from "@/types";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { useThreadPatch } from "@/hooks/fetchers/Thread/useThreadPatch";
import { cn } from "@/lib/utils";

import type { ChatMessageGroup } from "../MessageGroup";

export function MessageSwitcher({
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
