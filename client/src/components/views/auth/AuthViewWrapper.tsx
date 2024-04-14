import { KeyboardAvoidingView, View } from "react-native";

export function AuthViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex-1 w-full h-full mx-auto text-base bg-accent text-foreground">
			<View className="flex justify-center w-full h-full max-w-full px-0 pb-0 mx-auto sm:pb-16 sm:max-w-2xl sm:px-8">
				<KeyboardAvoidingView>{children}</KeyboardAvoidingView>
			</View>
		</View>
	);
}
