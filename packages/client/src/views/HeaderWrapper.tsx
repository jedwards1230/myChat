import NativeSafeAreaView from "@/components/NativeSafeAreaView";
import { View } from "react-native";

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <NativeSafeAreaView className="flex-1 bg-background text-foreground">
            <View className="relative flex flex-row items-center justify-center w-full h-12 px-2 py-2 pt-0 border-b native:pt-0 md:border-0 md:py-3 border-input">
                {children}
            </View>
        </NativeSafeAreaView>
    );
}
