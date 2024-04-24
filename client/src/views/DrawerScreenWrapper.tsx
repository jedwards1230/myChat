import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";

export function DrawerScreenWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TouchableWithoutFeedback className="flex-1 mt-8" onPress={Keyboard.dismiss}>
			<SafeAreaView className="items-center justify-between flex-1 w-full bg-background">
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
