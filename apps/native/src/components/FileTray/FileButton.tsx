import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

import type { FileData } from "../FileRouter";
import { RemoveFileButton } from "./DeleteButton";

export function FileButton({ data: { file } }: { data: FileData }) {
	const [pressed, setPressed] = useState(false);
	const router = useRouter();

	return (
		<View className="relative">
			<Pressable
				onPressIn={() => setPressed(true)}
				onPress={() => router.push(`/file/${file.name}`)}
				onPressOut={() => setPressed(false)}
				className={cn(
					"rounded-lg bg-background transition-all hover:bg-foreground/20",
					pressed && "bg-foreground/20",
				)}
			>
				<Text className="rounded border-2 border-border px-4 py-2 text-foreground">
					{file.name}
				</Text>
			</Pressable>
			<RemoveFileButton file={file} />
		</View>
	);
}
