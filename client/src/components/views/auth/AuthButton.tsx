import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";

export function AuthButton({
	children,
	...props
}: Parameters<typeof Pressable>[0] & { children: string }) {
	return (
		<Pressable
			{...props}
			className="min-w-full px-4 py-2 bg-foreground hover:bg-foreground/80"
		>
			<Text className="font-bold text-center text-background">{children}</Text>
		</Pressable>
	);
}
