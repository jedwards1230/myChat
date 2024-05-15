import * as React from "react";
import type { ComponentType } from "react";
import { type TextStyle, View } from "react-native";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
	PrismAsync as Highlighter,
	type SyntaxHighlighterProps as DefaultProps,
} from "react-syntax-highlighter";

import { Text } from "@/components/ui/Text";

type Node = {
	children?: Node[];
	properties?: { className: string[] };
	tagName?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
	type: string;
	value?: string | number;
};

type StyleSheet = { [key: string]: TextStyle };
type CSSSheet = { [key: string]: React.CSSProperties };

type RendererParams = {
	rows: Node[];
	stylesheet: StyleSheet | CSSSheet;
};

type SyntaxHighlighterProps = DefaultProps & { colorScheme: "light" | "dark" };

export const SyntaxHighlighter: React.FunctionComponent<SyntaxHighlighterProps> = (
	props
) => {
	const colorScheme = props.colorScheme;
	const theme = React.useMemo(
		() => Object.entries((colorScheme === "light" ? vs : vscDarkPlus) as StyleSheet),
		[colorScheme]
	);

	const cleanStyle = (style: TextStyle): TextStyle => ({
		...style,
		display: undefined,
	});

	const stylesheet: StyleSheet = Object.fromEntries(
		theme.map(([className, style]) => [className, cleanStyle(style)])
	);

	const renderNode = (nodes: Node[], key = "0") =>
		nodes.reduce<React.ReactNode[]>((acc, node, index) => {
			if (node.children) {
				if (props.language) {
					const properties = node.properties?.className || [];
					acc.push(
						<Text
							key={`${key}.${index}`}
							className="h-6"
							style={properties.map((c) => stylesheet[c])}
						>
							{renderNode(node.children, `${key}.${index}`)}
						</Text>
					);
				} else {
					acc.push(
						<Text className="h-6" key={`${key}.${index}`}>
							{renderNode(node.children, `${key}.${index}`)}
						</Text>
					);
				}
			}

			if (node.value) acc.push(node.value);

			return acc;
		}, []);

	const nativeRenderer = ({ rows }: RendererParams) => (
		<View className="!p-4 flex-shrink rounded-b-md min-w-full !bg-accent overflow-x-auto">
			{renderNode(rows)}
		</View>
	);

	return (
		<Highlighter
			{...props}
			CodeTag={Text}
			PreTag={View}
			codeTagProps={{
				className: "font-mono leading-4 web:leading-5 w-full",
			}}
			customStyle={{ padding: 0 }}
			renderer={nativeRenderer}
			style={
				stylesheet as {
					[key: string]: React.CSSProperties;
				}
			}
		/>
	);
};

export default SyntaxHighlighter;
