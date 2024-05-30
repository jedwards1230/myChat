import type { PropsWithChildren } from "react";
import type { MarkdownProps } from "react-native-markdown-display";
import ReactMarkdown from "react-markdown";

type MarkdownComponentProps = PropsWithChildren<MarkdownProps>;
const Markdown = ReactMarkdown;

export type { Components as Rules } from "react-markdown";
export type { MarkdownComponentProps };
export { Markdown };
