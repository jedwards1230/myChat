import { View } from "react-native";
import { Link, Stack } from "expo-router";
import { Text } from "@/components/ui/Text";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View className="flex flex-1 items-center justify-center bg-background p-4 text-foreground">
				<Text className="text-2xl font-bold">This screen doesn't exist.</Text>

				<Link className="mt-4 py-4" href="/">
					<Text className="text-[#2e78b7]">Go to home screen!</Text>
				</Link>
			</View>
		</>
	);
}
