import { KeyboardAvoidingView, View } from "react-native";

export function AuthViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="h-full text-base bg-accent text-foreground">
			<View className="flex justify-center h-full px-8 pb-16">
				<KeyboardAvoidingView>{children}</KeyboardAvoidingView>
			</View>
		</View>
	);
}
