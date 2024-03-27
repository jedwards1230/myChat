import type { PropsWithChildren } from "react";
import Markdown, { type MarkdownProps } from "react-native-markdown-display";

import MarkdownTheme from "@/lib/constants/MarkdownTheme";
import { useColorScheme } from "@/lib/useColorScheme";
import markdownRules from "./rules";

type MarkdownComponentProps = PropsWithChildren<MarkdownProps>;

export default function MarkdownComponent(props: MarkdownComponentProps) {
	const { style, ...rest } = props;
	const { colorScheme } = useColorScheme();

	return (
		<Markdown
			style={{
				...MarkdownTheme[colorScheme],
				...style,
			}}
			rules={markdownRules}
			{...rest}
		/>
	);
}
