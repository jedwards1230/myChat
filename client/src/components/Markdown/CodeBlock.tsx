import { Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { Text } from "../ui/Text";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { Feather } from "../ui/Icon";
import { useState } from "react";

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
		<View className="relative w-full pb-2 pr-0 native:pr-2">
			<View className="flex-row items-center justify-between h-8 px-4 py-1 rounded-t-lg bg-foreground/10 native:bg-foreground/10">
				<Text className="text-xs text-secondary-foreground">{language}</Text>
				<CopyButton content={children} />
			</View>
			<SyntaxHighlighter colorScheme={colorScheme} language={language}>
				{children}
			</SyntaxHighlighter>
		</View>
	);
}

function CopyButton({ content }: { content: string }) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		setCopied(true);
		await Clipboard.setStringAsync(content);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Text
			onPress={copy}
			className="flex flex-row items-center gap-1 text-secondary-foreground/60 hover:text-secondary-foreground"
		>
			<>
				<Feather name="clipboard" />{" "}
			</>
			<Text className="text-sm md:text-xs">{copied ? "Copied!" : "Copy"}</Text>
		</Text>
	);
}
