import React from "react";
import { View } from "react-native";
import { type MarkdownProps } from "react-native-markdown-display";
import { BlockQuote, EM, H1, H2, H3, H4, H5, H6, HR, S } from "@expo/html-elements";

import { Text } from "@/components/ui/Text";

const markdownRules: MarkdownProps["rules"] = {
	body: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_body}>
			{children}
		</View>
	),

	text: (node, children, parent, styles) => (
		<Text key={node.key} className="leading-[1.25]" style={styles.text}>
			{node.content}
		</Text>
	),

	// Headings
	heading1: (node, children, parent, styles) => (
		<Text
			className="text-3xl font-bold"
			key={node.key}
			style={styles._VIEW_SAFE_heading1}
		>
			{children}
		</Text>
	),
	heading2: (node, children, parent, styles) => (
		<Text
			className="text-2xl font-bold"
			key={node.key}
			style={styles._VIEW_SAFE_heading2}
		>
			{children}
		</Text>
	),
	heading3: (node, children, parent, styles) => (
		<Text
			className="text-xl font-bold"
			key={node.key}
			style={styles._VIEW_SAFE_heading3}
		>
			{children}
		</Text>
	),
	heading4: (node, children, parent, styles) => (
		<Text
			className="text-xl font-semibold"
			key={node.key}
			style={styles._VIEW_SAFE_heading4}
		>
			{children}
		</Text>
	),
	heading5: (node, children, parent, styles) => (
		<Text
			className="text-lg font-semibold"
			key={node.key}
			style={styles._VIEW_SAFE_heading5}
		>
			{children}
		</Text>
	),
	heading6: (node, children, parent, styles) => (
		<Text className="font-semibold" key={node.key} style={styles._VIEW_SAFE_heading6}>
			{children}
		</Text>
	),

	// Horizontal Rule
	hr: (node, children, parent, styles) => (
		<HR key={node.key} style={styles._VIEW_SAFE_hr} />
	),

	// Emphasis
	strong: (node, children, parent, styles) => (
		<Text className="font-bold" key={node.key} style={styles.strong}>
			{children}
		</Text>
	),
	em: (node, children, parent, styles) => (
		<EM key={node.key} style={styles.em}>
			{children}
		</EM>
	),
	s: (node, children, parent, styles) => (
		<S key={node.key} style={styles.s}>
			{children}
		</S>
	),

	// Blockquotes
	blockquote: (node, children, parent, styles) => (
		<BlockQuote key={node.key} style={styles._VIEW_SAFE_blockquote}>
			{children}
		</BlockQuote>
	),

	// Code
	code_inline: (node, children, parent, styles, inheritedStyles = {}) => (
		<Text
			key={node.key}
			className="p-1.5 bg-transparent"
			style={[inheritedStyles, styles.code_inline]}
		>
			{node.content}
		</Text>
	),

	// Lists
	bullet_list: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_bullet_list}>
			{children}
		</View>
	),
	ordered_list: (node, children, parent, styles) => (
		<View
			key={node.key}
			className="text-foreground"
			style={styles._VIEW_SAFE_ordered_list}
		>
			{children}
		</View>
	),
};

export default markdownRules;

/* const renderRules: MarkdownProps["rules"] = {
	// when unknown elements are introduced, so it wont break
	unknown: (node, children, parent, styles) => null,

	// Code
	code_block: (node, children, parent, styles, inheritedStyles = {}) => {
		// we trim new lines off the end of code blocks because the parser sends an extra one.
		let { content } = node;

		if (
			typeof node.content === "string" &&
			node.content.charAt(node.content.length - 1) === "\n"
		) {
			content = node.content.substring(0, node.content.length - 1);
		}

		return (
			<Text key={node.key} style={[inheritedStyles, styles.code_block]}>
				{content}
			</Text>
		);
	},
	fence: (node, children, parent, styles, inheritedStyles = {}) => {
		// we trim new lines off the end of code blocks because the parser sends an extra one.
		let { content } = node;

		if (
			typeof node.content === "string" &&
			node.content.charAt(node.content.length - 1) === "\n"
		) {
			content = node.content.substring(0, node.content.length - 1);
		}

		return (
			<Text key={node.key} style={[inheritedStyles, styles.fence]}>
				{content}
			</Text>
		);
	},

	// Tables
	table: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_table}>
			{children}
		</View>
	),
	thead: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_thead}>
			{children}
		</View>
	),
	tbody: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_tbody}>
			{children}
		</View>
	),
	th: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_th}>
			{children}
		</View>
	),
	tr: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_tr}>
			{children}
		</View>
	),
	td: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_td}>
			{children}
		</View>
	),

	// Links
	link: (node, children, parent, styles, onLinkPress) => (
		<Text
			key={node.key}
			style={styles.link}
			onPress={() => openUrl(node.attributes.href, onLinkPress)}
		>
			{children}
		</Text>
	),
	blocklink: (node, children, parent, styles, onLinkPress) => (
		<TouchableWithoutFeedback
			key={node.key}
			onPress={() => openUrl(node.attributes.href, onLinkPress)}
			style={styles.blocklink}
		>
			<View style={styles.image}>{children}</View>
		</TouchableWithoutFeedback>
	),

	// Images
	image: (
		node,
		children,
		parent,
		styles,
		allowedImageHandlers,
		defaultImageHandler
	) => {
		const { src, alt } = node.attributes;

		// we check that the source starts with at least one of the elements in allowedImageHandlers
		const show =
			allowedImageHandlers.filter((value) => {
				return src.toLowerCase().startsWith(value.toLowerCase());
			}).length > 0;

		if (show === false && defaultImageHandler === null) {
			return null;
		}

		const imageProps: IFitImageProps & { key: string } = {
			indicator: true,
			key: node.key,
			style: styles._VIEW_SAFE_image,
			source: {
				uri: show === true ? src : `${defaultImageHandler}${src}`,
			},
		};

		if (alt) {
			imageProps.accessible = true;
			imageProps.accessibilityLabel = alt;
		}

		return <FitImage {...imageProps} />;
	},

	// Text Output
	textgroup: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.textgroup}>
			{children}
		</Text>
	),
	paragraph: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_paragraph}>
			{children}
		</View>
	),
	hardbreak: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.hardbreak}>
			{"\n"}
		</Text>
	),
	softbreak: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.softbreak}>
			{"\n"}
		</Text>
	),

	// Believe these are never used but retained for completeness
	pre: (node, children, parent, styles) => (
		<View key={node.key} style={styles._VIEW_SAFE_pre}>
			{children}
		</View>
	),
	inline: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.inline}>
			{children}
		</Text>
	),
	span: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.span}>
			{children}
		</Text>
	),
}; */
