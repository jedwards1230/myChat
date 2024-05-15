import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import NativeSafeAreaView from "@/components/NativeSafeAreaView";

export function HeaderWrapper({
	title,
	children,
}: {
	title?: string;
	children?: React.ReactNode;
}) {
	return (
		<NativeSafeAreaView className="flex-1 bg-background text-foreground">
			<View className="relative flex flex-row items-center justify-center w-full h-12 px-2 py-2 pt-0 border-b native:pt-0 md:border-0 md:py-3 border-input">
				{title && <Text>{title}</Text>}
				{children}
			</View>
		</NativeSafeAreaView>
	);
}
