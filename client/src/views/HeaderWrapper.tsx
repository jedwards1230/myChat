import { View } from "react-native";

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <View className="relative flex flex-row items-center justify-center w-full h-12 px-2 py-2 border-b bg-background text-foreground md:border-0 md:py-3 border-input">
            {children}
        </View>
    );
}
