import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
} from "react-native";

export function DrawerScreenWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TouchableWithoutFeedback className="mt-8 flex-1" onPress={Keyboard.dismiss}>
			<SafeAreaView className="w-full flex-1 items-center justify-between bg-background">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1 pt-12"
					keyboardVerticalOffset={64}
				>
					{children}
				</KeyboardAvoidingView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
