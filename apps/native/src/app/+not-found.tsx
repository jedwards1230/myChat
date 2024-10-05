import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View className="flex items-center justify-center flex-1 p-4 bg-background text-foreground">
                <Text className="text-2xl font-bold">This screen doesn't exist.</Text>

                <Link className="py-4 mt-4" href="/">
                    <Text className="text-[#2e78b7]">Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
