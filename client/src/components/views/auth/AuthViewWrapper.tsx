import { KeyboardAvoidingView, View } from "react-native";

export function AuthViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="w-full h-full max-w-full mx-auto text-base sm:max-w-2xl bg-accent text-foreground">
			<View className="flex justify-center h-full px-0 pb-0 sm:pb-16 sm:px-8">
				<KeyboardAvoidingView>{children}</KeyboardAvoidingView>
			</View>
		</View>
	);
}
