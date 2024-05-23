import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";

import { Text } from "@mychat/ui/native/Text";

import type { RouterChildrenProps, RouterData } from "../FileRouter";
import { RemoveFileButton } from "./DeleteButton";

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

	if (!file) {
		console.warn("No file found in FolderButton");
		return null;
	}
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
