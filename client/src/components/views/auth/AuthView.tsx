import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";
import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";

export function AuthView() {
	return (
		<AuthViewWrapper>
			<View className="p-8 border rounded shadow-sm bg-background border-border">
				<View className="flex gap-4">
					<Text className="text-xl font-semibold text-center">Auth View</Text>
					<Link asChild href="/(auth)/login">
						<AuthButton>Login</AuthButton>
					</Link>
					<Link asChild href="/(auth)/signup">
						<AuthButton>Sign Up</AuthButton>
					</Link>
				</View>
			</View>
		</AuthViewWrapper>
	);
}
