import { KeyboardAvoidingView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";

export function AuthView() {
	return (
		<View className="h-full text-base bg-accent text-foreground">
			<View className="flex justify-center h-full px-8 pb-16">
				<KeyboardAvoidingView>
					<AuthCard />
				</KeyboardAvoidingView>
			</View>
		</View>
	);
}

function AuthCard() {
	return (
		<View className="p-8 border rounded shadow-sm bg-background border-border">
			<View className="flex gap-4">
				<Text className="text-xl font-semibold text-center">Auth View</Text>
				<Link className="w-full p-4 bg-foreground" href="/(auth)/login">
					<Text className="font-bold text-center text-background">Login</Text>
				</Link>
				<Link className="w-full p-4 bg-foreground" href="/(auth)/signup">
					<Text className="font-bold text-center text-background">Sign Up</Text>
				</Link>
			</View>
		</View>
	);
}
