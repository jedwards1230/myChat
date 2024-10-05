import { View } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/components/ui/Text";

import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";

export function AuthView() {
	return (
		<AuthViewWrapper>
			<View className="rounded border border-transparent !bg-background p-8 shadow-sm sm:border-border">
				<View className="flex gap-4">
					<Text className="text-center text-xl font-semibold">Auth View</Text>
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
