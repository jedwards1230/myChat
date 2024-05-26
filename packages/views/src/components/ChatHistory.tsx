import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@mychat/ui/native/Button";
import { AngleDown } from "@mychat/ui/svg";

import { MessageGroup, useGroupedMessages } from "./MessageGroups/MessageGroup";

export default function ChatHistory({
	isLoading,
	threadId,
}: {
	isLoading: boolean;
	threadId: string;
}) {
	const viewRef = useRef<View>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const { messageGroups, isError } = useGroupedMessages(threadId);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const isCloseToBottom =
			contentOffset.y + layoutMeasurement.height > contentSize.height - 50;
		setShowScrollButton(!isCloseToBottom);
	};

	const scrollToBottom = () =>
		messageGroups.length > 0 &&
		scrollViewRef.current?.scrollToEnd({ animated: true });

	useEffect(() => {
		if (!viewRef.current) return;
		viewRef.current.measure((x, y, width, height) => {
			if (height > 0) scrollToBottom();
		});
	}, []);

	if (isError) return null;
	return (
		<View ref={viewRef} className="relative flex w-full flex-1 gap-4">
			{messageGroups.length > 0 && (
				<ScrollView
					ref={scrollViewRef}
					onScroll={onScroll}
					scrollEventThrottle={50}
					className="scroll-smooth"
				>
					{messageGroups.map((item, index) => (
						<MessageGroup
							key={index.toString() + item.messages.length}
							item={item}
							index={index}
							isLoading={isLoading}
							messageGroups={messageGroups}
						/>
					))}
				</ScrollView>
			)}
			{showScrollButton && (
				<View className="absolute bottom-4 left-0 right-0 flex items-center">
					<ScrollButton onPress={scrollToBottom} />
				</View>
			)}
		</View>
	);
}

function ScrollButton({ onPress }: { onPress: () => void }) {
	return (
		<Button variant="outline" size="icon" onPress={onPress} className="rounded-full">
			<AngleDown className="text-foreground/90" />
		</Button>
	);
}
