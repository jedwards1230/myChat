import { View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { Text } from "../ui/Text";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { Feather } from "../ui/Icon";

export function CodeBlock({
	children,
	colorScheme,
	language,
}: {
	children: string;
	colorScheme: "light" | "dark";
	language?: string;
}) {
	return (
		<View className="relative w-full pr-0 native:pr-2">
			<View className="flex-row items-center justify-between h-8 px-4 py-1 rounded-t-lg bg-foreground/10 native:bg-foreground/10">
				<Text className="text-xs text-secondary-foreground">{language}</Text>
				<Text
					onPress={() => Clipboard.setStringAsync(children)}
					className="flex flex-row items-center gap-1 text-xs text-secondary-foreground/60 hover:text-secondary-foreground"
				>
					<Feather name="clipboard" size={14} />
					Copy
				</Text>
			</View>
			<SyntaxHighlighter colorScheme={colorScheme} language={language}>
				{children}
			</SyntaxHighlighter>
		</View>
	);
}
