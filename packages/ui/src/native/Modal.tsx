import { SafeAreaView, View } from "react-native";
import { Link, router } from "expo-router";

import { Text } from "../native/Text";
import { ScrollView } from "./ScrollView";

export default function ModalWrapper({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	const isPresented = router.canGoBack();

	return (
		<SafeAreaView className="flex-1 bg-secondary">
			<ScrollView className="flex w-full flex-1 flex-col items-center gap-8 p-4">
				<View className="pt-4">
					{!isPresented && (
						<Link className="text-primary" href="/(app)">
							Dismiss
						</Link>
					)}
					{title && (
						<Text className="text-center text-lg font-bold">{title}</Text>
					)}
				</View>
				<View className="gap-6 p-4">{children}</View>
			</ScrollView>
		</SafeAreaView>
	);
}
