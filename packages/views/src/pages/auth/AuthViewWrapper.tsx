import { KeyboardAvoidingView, View } from "react-native";

export function AuthViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="mx-auto h-full w-full flex-1 bg-accent text-base text-foreground">
			<View className="mx-auto flex h-full w-full max-w-full justify-center px-0 pb-0 sm:max-w-2xl sm:px-8 sm:pb-16">
				<KeyboardAvoidingView>{children}</KeyboardAvoidingView>
			</View>
		</View>
	);
}
