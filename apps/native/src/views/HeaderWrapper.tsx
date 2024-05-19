import { View } from "react-native";
import NativeSafeAreaView from "@/components/NativeSafeAreaView";
import { Text } from "@/components/ui/Text";

export function HeaderWrapper({
	title,
	children,
}: {
	title?: string;
	children?: React.ReactNode;
}) {
	return (
		<NativeSafeAreaView className="flex-1 bg-background text-foreground">
			<View className="native:pt-0 relative flex h-12 w-full flex-row items-center justify-center border-b border-input px-2 py-2 pt-0 md:border-0 md:py-3">
				{title && <Text>{title}</Text>}
				{children}
			</View>
		</NativeSafeAreaView>
	);
}
