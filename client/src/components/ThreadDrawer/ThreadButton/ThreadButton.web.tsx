import { View } from "react-native";
import React from "react";

import type { Thread } from "@/types";
import { Text } from "@/components/ui/Text";

import LinkButton from "../LinkButton";
import { ThreadButtonPopover } from "./ThreadButtonPopover";

export function ThreadButton({ thread }: { thread: Thread }) {
    return (
        <View className="relative flex flex-row items-center w-full group">
            <LinkButton
                className="pr-8"
                href={{ pathname: `/(main)/`, params: { c: thread.id } }}
            >
                <Text numberOfLines={1} ellipsizeMode="tail">
                    {thread.title || "New chat"}
                </Text>
            </LinkButton>
            <ThreadButtonPopover thread={thread} />
        </View>
    );
}
