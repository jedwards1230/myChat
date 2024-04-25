import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Pressable } from "react-native";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";
import { RemoveFileButton } from "./DeleteButton";
import { RouterChildrenProps, RouterData } from "../FileRouter";

export function FolderButton({
    data,
}: {
    baseDir: string;
    data: RouterData;
    routerComponents?: RouterChildrenProps;
}) {
    const [pressed, setPressed] = useState(false);
    const router = useRouter();
    const file = data.files[0];

    return (
        <View className="relative">
            <Pressable
                onPressIn={() => setPressed(true)}
                onPress={() => router.push(`/file/${file.name}`)}
                onPressOut={() => setPressed(false)}
                className={cn(
                    "transition-all rounded-lg bg-background hover:bg-foreground/20",
                    pressed && "bg-foreground/20"
                )}
            >
                <Text className="px-4 py-2 border-2 rounded border-border text-foreground">
                    {file.name}
                </Text>
            </Pressable>
            <RemoveFileButton file={file} />
        </View>
    );
}
