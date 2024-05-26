import { useState } from "react";
import { View } from "react-native";
import * as ClipboardLib from "expo-clipboard";

import { Text } from "../native/Text";
import { Clipboard } from "../svg";
import SyntaxHighlighter from "./SyntaxHighlighter";

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
		<View className="native:pr-2 relative w-full pb-2 pr-0">
			<View className="native:bg-foreground/10 h-8 flex-row items-center justify-between rounded-t-lg bg-foreground/10 px-4 py-1">
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
		await ClipboardLib.setStringAsync(content);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Text
			onPress={copy}
			className="flex flex-row items-center gap-1 text-secondary-foreground/60 hover:text-secondary-foreground"
		>
			<>
				<Clipboard />{" "}
			</>
			<Text className="text-sm md:text-xs">{copied ? "Copied!" : "Copy"}</Text>
		</Text>
	);
}
