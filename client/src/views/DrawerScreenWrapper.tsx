import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";

export function DrawerScreenWrapper({ children }: { children: React.ReactNode }) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-background"
            >
                <SafeAreaView className="items-center justify-between flex-1 w-full">
                    {children}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
