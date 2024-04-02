import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";

import { useMessagesSuspenseQuery } from "@/lib/queries/useMessagesQuery";
import { Button } from "@/components/ui/Button";
import { AntDesign } from "@/components/ui/Icon";
import { MessageGroup, groupMessages } from "@/components/MessageGroups/MessageGroup";

export default function ChatHistory({
	isLoading,
	threadId,
}: {
	isLoading: boolean;
	threadId: string;
}) {
	const router = useRouter();
	const viewRef = useRef<View>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const isCloseToBottom =
			contentOffset.y + layoutMeasurement.height > contentSize.height - 50;
		setShowScrollButton(!isCloseToBottom);
	};

	const { data, isError } = useMessagesSuspenseQuery(threadId!);
	const messageGroups = useMemo(() => groupMessages(data), [data]);

	const scrollToBottom = () =>
		messageGroups.length > 0 &&
		scrollViewRef.current?.scrollToEnd({ animated: true });

	useEffect(() => {
		if (isError) {
			router.push("/(chat)");
		}
	}, [isError]);

	useEffect(() => {
		if (viewRef.current) {
			viewRef.current.measure((x, y, width, height) => {
				if (height > 0) {
					scrollToBottom();
				}
			});
		}
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
							key={index.toString()}
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
			<AntDesign name="down" size={18} className="text-foreground/90" />
		</Button>
	);
}
