import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Pressable } from "react-native";

import { CacheFile } from "@/types";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";
import { useFileStore } from "@/lib/stores/fileStore";
import { MaterialIcons } from "@/components/ui/Icon";

export function FileButton({ file }: { file: CacheFile }) {
	const [pressed, setPressed] = useState(false);
	const router = useRouter();

	return (
		<View className="relative">
			<Pressable
				onPressIn={() => setPressed(true)}
				onPress={() => router.push(`/file/cache/${file.name}`)}
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
			<CloseButton file={file} />
		</View>
	);
}

function CloseButton({ file }: { file: CacheFile }) {
	const removeFile = useFileStore((state) => state.removeFile);
	return (
		<Pressable
			onPress={(e) => {
				e.stopPropagation();
				removeFile(file);
			}}
			className="absolute z-10 flex items-center justify-center w-4 h-4 rounded-full -top-2 -right-2 group bg-background hover:bg-foreground/20"
		>
			<MaterialIcons
				name="close"
				size={16}
				className="text-foreground/60 group-hover:text-foreground"
			/>
		</Pressable>
	);
}
