import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export function Avatar({ role, name }: { role: "assistant" | "user"; name: string }) {
	return (
		<View
			className={cn(
				"flex items-center justify-center w-6 h-6 rounded-full bg-primary",
				role === "user" ? "bg-black" : "bg-input"
			)}
		>
			<Text
				className={cn(
					"text-sm text-center",
					role === "user" ? "text-primary" : "text-secondary-foreground"
				)}
			>
				{name[0].toUpperCase()}
			</Text>
		</View>
	);
}
