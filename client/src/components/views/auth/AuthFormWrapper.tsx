import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { AuthViewWrapper } from "./AuthViewWrapper";

export function AuthFormWrapper({ children }: { children: React.ReactNode }) {
	return (
		<AuthViewWrapper>
			<View className="p-8 border rounded shadow-sm bg-background border-border">
				<View className="flex gap-4">{children}</View>
			</View>
		</AuthViewWrapper>
	);
}

export function ErrorMessage({ children }: { children: string }) {
	return <Text className="text-center text-red-500">{children}</Text>;
}
