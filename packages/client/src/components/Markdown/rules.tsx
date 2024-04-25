import { Platform, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { ASTNode, hasParents, type MarkdownProps } from "react-native-markdown-display";
import { cssInterop } from "nativewind";

import { cn } from "@/lib/utils";
import { Text, TextProps } from "../ui/Text";
import { ExternalLink } from "../ExternalLink";
import { CodeBlock } from "./CodeBlock";

cssInterop(Image, { className: "style" });

// This is a hack to check if a node has a parent of a certain type
// This is useful for the Text element and handling style inheritance for React Native
function hasParent(parents: ASTNode[], ...filters: string[]) {
    return parents.some((parent) => filters.includes(parent.type));
}

export const getMarkdownRules = (
    colorScheme: "light" | "dark"
): MarkdownProps["rules"] => ({
    body: (node, children) => (
        <View accessible={false} key={node.key} className="pl-2 md:pl-0">
            {children}
        </View>
    ),
    text: (node, children, parents) => {
        if (!node.content) return null;

        const hasLink = hasParent(parents, "link");
        const hasHeader = hasParent(
            parents,
            "heading1",
            "heading2",
            "heading3",
            "heading4",
            "heading5",
            "heading6"
        );

        const props: TextProps = {
            ...(hasHeader && { variant: "raw" as const, skipContext: true }),
            ...(hasLink && { variant: "raw" as const }),
        };

        return (
            <Text key={node.key} {...props}>
                {node.content}
            </Text>
        );
    },
    textgroup: (node, children) =>
        node.children.length === 1 && node.children[0].type === "softbreak" ? null : (
            <Text skipContext={true} key={node.key}>
                {children}
            </Text>
        ),
    paragraph: (node, children, parents) => {
        const hasBlockquote = hasParent(parents, "blockquote");

        return (
            <View key={node.key} className={cn(hasBlockquote ? "pb-1 md:pb-0" : "pb-2")}>
                {children}
            </View>
        );
    },
    hardbreak: (node) => <Text key={node.key}>{"\n"}</Text>,
    softbreak: () => null,
    heading1: (node, children) => (
        <Text className="mb-6 !text-4xl font-bold" key={node.key}>
            {children}
        </Text>
    ),
    heading2: (node, children) => (
        <Text className="mb-5 text-3xl font-bold" key={node.key}>
            {children}
        </Text>
    ),
    heading3: (node, children) => (
        <Text className="mb-4 text-2xl font-bold" key={node.key}>
            {children}
        </Text>
    ),
    heading4: (node, children) => (
        <Text className="mb-2 text-xl font-semibold" key={node.key}>
            {children}
        </Text>
    ),
    heading5: (node, children) => (
        <Text className="mb-1 text-lg font-semibold" key={node.key}>
            {children}
        </Text>
    ),
    heading6: (node, children) => (
        <Text className="mb-1 font-semibold" key={node.key}>
            {children}
        </Text>
    ),
    hr: (node) => <View className="w-full h-1 my-6 md:my-12 bg-input" key={node.key} />,
    strong: (node, children) => (
        <Text className="font-bold" key={node.key}>
            {children}
        </Text>
    ),
    em: (node, children) => (
        <Text className="italic" key={node.key}>
            {children}
        </Text>
    ),
    s: (node, children) => (
        <Text className="line-through" key={node.key}>
            {children}
        </Text>
    ),
    blockquote: (node, children, parents) => {
        const hasHeader = hasParent(parents, "blockquote");
        return (
            <View
                key={node.key}
                className={cn(
                    "px-2 py-2 ml-2 border-l md:border-l-2 border-foreground/50",
                    !hasHeader && "mb-2"
                )}
            >
                {children}
            </View>
        );
    },
    bullet_list: (node, children) => (
        <View className="leading-6" key={node.key}>
            {children}
        </View>
    ),
    ordered_list: (node, children) => (
        <View key={node.key} className="leading-6">
            {children}
        </View>
    ),
    list_item: (node, children, parent) => {
        if (hasParents(parent, "bullet_list")) {
            return (
                <View className="flex-row justify-start" key={node.key}>
                    <Text
                        className="ml-0 mr-2 md:-ml-2 text-foreground/70 md:text-foreground/50"
                        accessible={false}
                    >
                        {Platform.select({
                            android: "\u2022",
                            ios: "\u00B7",
                            default: "\u2022",
                        })}
                    </Text>
                    <View className="flex-1">{children}</View>
                </View>
            );
        }

        if (hasParents(parent, "ordered_list")) {
            const orderedListIndex = parent.findIndex((el) => el.type === "ordered_list");
            const orderedList = parent[orderedListIndex];

            let listItemNumber;
            if (orderedList.attributes && orderedList.attributes.start) {
                listItemNumber = orderedList.attributes.start + node.index;
            } else {
                listItemNumber = node.index + 1;
            }

            return (
                <View className="flex-row justify-start" key={node.key}>
                    <Text className="ml-0 mr-2 md:-ml-2 text-foreground/70 md:text-foreground/50">
                        {listItemNumber}
                        {node.markup}
                    </Text>
                    <View className="flex-1">{children}</View>
                </View>
            );
        }

        // we should not need this, but just in case
        return <View key={node.key}>{children}</View>;
    },
    code_inline: (node) => (
        <Text key={node.key} className="font-semibold">
            `{node.content}`
        </Text>
    ),
    code_block: (node) => {
        // we trim new lines off the end of code blocks because the parser sends an extra one.
        let { content } = node;

        if (
            typeof node.content === "string" &&
            node.content.charAt(node.content.length - 1) === "\n"
        ) {
            content = node.content.substring(0, node.content.length - 1);
        }

        return (
            <CodeBlock key={node.key} colorScheme={colorScheme}>
                {content}
            </CodeBlock>
        );
    },
    fence: (node) => {
        // we trim new lines off the end of code blocks because the parser sends an extra one.
        let { content } = node;
        const languageRaw: string | undefined = (node as any).sourceInfo;
        const language = languageRaw?.trim();

        if (
            typeof node.content === "string" &&
            node.content.charAt(node.content.length - 1) === "\n"
        ) {
            content = node.content.substring(0, node.content.length - 1);
        }

        return (
            <CodeBlock key={node.key} colorScheme={colorScheme} language={language}>
                {content}
            </CodeBlock>
        );
    },
    table: (node, children) => (
        <View
            className="border border-collapse text-left rounded-md !border-foreground/30"
            key={node.key}
        >
            {children}
        </View>
    ),
    thead: (node, children) => (
        <View className="!bg-foreground/10 dark:!bg-foreground/20" key={node.key}>
            {children}
        </View>
    ),
    tbody: (node, children) => <View key={node.key}>{children}</View>,
    th: (node, children) => (
        <View className="flex-1 p-2" key={node.key}>
            {children}
        </View>
    ),
    tr: (node, children) => (
        <View className="flex-row border-b border-foreground" key={node.key}>
            {children}
        </View>
    ),
    td: (node, children) => (
        <View className="flex-1 p-2" key={node.key}>
            {children}
        </View>
    ),
    link: (node, children) => (
        <ExternalLink
            key={node.key}
            href={node.attributes.href}
            className="!text-primary"
        >
            {children}
        </ExternalLink>
    ),
    blocklink: (node, children) => (
        <ExternalLink
            key={node.key}
            href={node.attributes.href}
            className="flex-1 border-b border-input"
        >
            <View>{children}</View>
        </ExternalLink>
    ),
    image: (node) => {
        const { src, alt } = node.attributes;

        const allowedImageHandlers = [
            "data:image/png;base64",
            "data:image/gif;base64",
            "data:image/jpeg;base64",
            "https://",
            "http://",
        ];

        const show =
            allowedImageHandlers.filter((value) => {
                return src.toLowerCase().startsWith(value.toLowerCase());
            }).length > 0;

        if (show === false) return null;
        return (
            <ExternalLink
                asChild
                className="flex flex-1 w-full"
                key={node.key}
                href={src}
            >
                <Pressable>
                    <Image
                        className="w-full h-96"
                        contentFit="contain"
                        onError={(e) => console.error(e)}
                        source={src}
                        {...(alt && {
                            accessibilityLabel: alt,
                            ...(Platform.OS !== "web" && { accessible: true }),
                        })}
                        {...(Platform.OS === "ios" && {
                            enableLiveTextInteraction: true,
                        })}
                    />
                </Pressable>
            </ExternalLink>
        );
    },
    pre: (node, children) => <View key={node.key}>{children}</View>,
    inline: (node, children) => <Text key={node.key}>{children}</Text>,
    span: (node, children) => <Text key={node.key}>{children}</Text>,
    unknown: () => null,
});
