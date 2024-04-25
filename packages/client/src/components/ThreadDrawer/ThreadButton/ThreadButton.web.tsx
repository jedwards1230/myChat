import { View } from "react-native";
import React from "react";

import type { Thread } from "@/types";
import { Text } from "@/components/ui/Text";

import LinkButton from "../LinkButton";
import { ThreadButtonPopover } from "./ThreadButtonPopover";
import { useConfigStore } from "@/hooks/stores/configStore";

export function ThreadButton({ thread }: { thread: Thread }) {
    const threadId = useConfigStore.use.threadId();
    return (
        <View className="relative flex flex-row items-center w-full group/thread">
            <LinkButton
                active={thread.id === threadId}
                className="w-full pr-4 group-hover/thread:pr-8"
                href={{ pathname: `/(app)/`, params: { c: thread.id } }}
            >
                <Text numberOfLines={1} ellipsizeMode="tail">
                    {thread.title || "New chat"}
                </Text>
            </LinkButton>
            <ThreadButtonPopover thread={thread} />
        </View>
    );
}
