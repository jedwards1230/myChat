import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlashList, ViewToken } from "@shopify/flash-list";
import { useRouter } from "expo-router";

import type { ChatMessageGroup } from "./MessageGroups/MessageGroup";
import { Button } from "../../ui/Button";
import { AntDesign } from "@/components/ui/Icon";
import { useMessagesQuery } from "@/lib/queries/useMessagesQuery";
import { useConfigStore } from "@/lib/stores/configStore";
import { MessageGroup, groupMessages } from "./MessageGroups/MessageGroup";

export default function ChatHistory({
	isLoading,
	threadIdOverride,
}: {
	isLoading: boolean;
	threadIdOverride?: string;
}) {
	const router = useRouter();
	const activeThreadId = useConfigStore((state) => state.threadId);
	const threadId = threadIdOverride || activeThreadId;

	const { data: messages, isPending, isError, error } = useMessagesQuery(threadId);
	const messageGroups = useMemo(() => groupMessages(messages), [messages]);

	const viewRef = useRef<View>(null);
	const scrollViewRef = useRef<FlashList<ChatMessageGroup>>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const isCloseToBottom =
			contentOffset.y + layoutMeasurement.height > contentSize.height - 50;
		setShowScrollButton(!isCloseToBottom);
	};

	const scrollToBottom = () =>
		messageGroups.length > 0 &&
		scrollViewRef.current?.scrollToEnd({ animated: true });

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			const lastItem = viewableItems[viewableItems.length - 1];
			if (!lastItem || lastItem.index !== messageGroups.length - 1) {
				setShowScrollButton(true);
			} else {
				setShowScrollButton(false);
			}
		},
		[messageGroups]
	);

	useEffect(() => {
		if (isError) {
			router.push("/(chat)");
		}
	}, [isError]);

	if (isPending || isError) return null;
	return (
		<View ref={viewRef} className="relative flex flex-1 w-full gap-4">
			{messageGroups.length > 0 && (
				<FlashList
					ref={scrollViewRef}
					data={messageGroups}
					keyExtractor={(_, i) => i.toString()}
					onScroll={onScroll}
					estimatedItemSize={36}
					extraData={{ isLoading }}
					initialScrollIndex={messageGroups.length - 1}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={{ minimumViewTime: 1 }}
					renderItem={({ item, index }) => (
						<MessageGroup
							item={item}
							index={index}
							isLoading={isLoading}
							messageGroups={messageGroups}
						/>
					)}
				/>
			)}
			{showScrollButton && (
				<View className="absolute left-0 right-0 flex items-center bottom-4">
					<ScrollButton onPress={scrollToBottom} />
				</View>
			)}
		</View>
	);
}

function ScrollButton({ onPress }: { onPress: () => void }) {
	return (
		<Button variant="outline" size="icon" onPress={onPress} className="rounded-full">
			<AntDesign name="down" size={18} className="text-foreground/90" />
		</Button>
	);
}
