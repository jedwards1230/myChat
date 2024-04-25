import * as React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Thread } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { useDeleteActiveThread } from "@/hooks/actions";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";

export function ThreadButtonPopover({ thread }: { thread: Thread }) {
    const session = useUserData((s) => s.session);
    const deleteThread = useDeleteActiveThread();

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    const items1 = [
        {
            icon: <Icon type="FontAwesome" name="trash" size={18} />,
            label: "Delete Thread",
            onClick: async () => {
                if (!thread.id || !session) return console.error("No threadId or userId");
                deleteThread.action(thread.id);
            },
        },
    ];

    return (
        <Popover className="hidden group-hover/thread:flex">
            <PopoverTrigger className="absolute top-0 bottom-0 self-center right-1 group">
                <Icon
                    type="AntDesign"
                    name="ellipsis1"
                    size={20}
                    className="z-10 group-aria-selected:text-background text-secondary-foreground/70 group-hover:text-secondary-foreground"
                />
            </PopoverTrigger>
            <PopoverContent
                side={Platform.OS === "web" ? "bottom" : "top"}
                insets={contentInsets}
                className="w-48"
            >
                {items1.map((item, i) => (
                    <Button key={i} variant="ghost" size="sm" onPress={item.onClick}>
                        <Text>{item.label}</Text>
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
}
