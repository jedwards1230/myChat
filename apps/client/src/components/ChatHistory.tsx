import {
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	ScrollView,
	View,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
	MessageGroup,
	useGroupedMessages,
} from "@/components/MessageGroups/MessageGroup";

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
		<View ref={viewRef} className="relative flex flex-1 w-full gap-4">
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
			<Icon type="AntDesign" name="down" size={18} className="text-foreground/90" />
		</Button>
	);
}
