import type { PropsWithChildren } from "react";
import type { MarkdownProps } from "react-native-markdown-display";
import MarkdownEl, { MarkdownIt } from "react-native-markdown-display";

type MarkdownComponentProps = PropsWithChildren<MarkdownProps>;

const markdownItInstance = MarkdownIt({ typographer: true, linkify: true });

function Markdown(props: MarkdownComponentProps) {
	return <MarkdownEl markdownit={markdownItInstance} {...props} />;
}

type Rules = MarkdownProps["rules"];
export type { MarkdownComponentProps, Rules };
export { Markdown };
export * from "react-native-markdown-display";
