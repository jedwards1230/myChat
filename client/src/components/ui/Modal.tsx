import { Link, router } from "expo-router";

import { Text } from "@/components/ui/Text";
import { ScrollView } from "./ScrollView";
import { SafeAreaView, View } from "react-native";

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
			<ScrollView className="flex flex-col items-center flex-1 w-full gap-8 p-4">
				<View className="pt-4">
					{!isPresented && (
						<Link className="text-primary" href="/(chat)">
							Dismiss
						</Link>
					)}
					{title && (
						<Text className="text-lg font-bold text-center">{title}</Text>
					)}
				</View>
				<View className="gap-6 p-4">{children}</View>
			</ScrollView>
		</SafeAreaView>
	);
}
