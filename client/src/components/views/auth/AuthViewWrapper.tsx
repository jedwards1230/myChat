import { KeyboardAvoidingView, View } from "react-native";

export function AuthViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="h-full text-base bg-accent text-foreground">
			<View className="flex justify-center h-full px-0 pb-0 md:pb-16 md:px-8">
				<KeyboardAvoidingView>{children}</KeyboardAvoidingView>
			</View>
		</View>
	);
}
