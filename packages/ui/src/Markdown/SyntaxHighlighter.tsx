import type { ComponentType } from "react";
import type { TextStyle } from "react-native";
import type { SyntaxHighlighterProps as DefaultProps } from "react-syntax-highlighter";
import * as React from "react";
import { View } from "react-native";
import { PrismAsync as Highlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Text } from "../native/Text";

interface Node {
	children?: Node[];
	properties?: { className: string[] };
	tagName?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
	type: string;
	value?: string | number;
}

type StyleSheet = Record<string, TextStyle>;
type CSSSheet = Record<string, React.CSSProperties>;

interface RendererParams {
	rows: Node[];
	stylesheet: StyleSheet | CSSSheet;
}

type SyntaxHighlighterProps = DefaultProps & { colorScheme: "light" | "dark" };

export const SyntaxHighlighter: React.FunctionComponent<SyntaxHighlighterProps> = (
	props,
) => {
	const colorScheme = props.colorScheme;
	const theme = Object.entries(
		(colorScheme === "light" ? vs : vscDarkPlus) as StyleSheet,
	);

	const cleanStyle = (style: TextStyle): TextStyle => ({
		...style,
		display: undefined,
	});

	const stylesheet: StyleSheet = Object.fromEntries(
		theme.map(([className, style]) => [className, cleanStyle(style)]),
	);

	const renderNode = (nodes: Node[], key = "0") =>
		nodes.reduce<React.ReactNode[]>((acc, node, index) => {
			if (node.children) {
				if (props.language) {
					const properties = node.properties?.className ?? [];
					acc.push(
						<Text
							key={`${key}.${index}`}
							className="h-6"
							style={properties.map((c) => stylesheet[c])}
						>
							{renderNode(node.children, `${key}.${index}`)}
						</Text>,
					);
				} else {
					acc.push(
						<Text className="h-6" key={`${key}.${index}`}>
							{renderNode(node.children, `${key}.${index}`)}
						</Text>,
					);
				}
			}

			if (node.value) acc.push(node.value);

			return acc;
		}, []);

	const nativeRenderer = ({ rows }: RendererParams) => (
		<View className="min-w-full flex-shrink overflow-x-auto rounded-b-md !bg-accent !p-4">
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
			style={stylesheet as Record<string, React.CSSProperties>}
		/>
	);
};

export default SyntaxHighlighter;
