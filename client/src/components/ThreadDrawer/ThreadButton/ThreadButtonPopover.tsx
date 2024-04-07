import * as React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Thread } from "@/types";
import { useConfigStore } from "@/hooks/stores/configStore";
import { useAction } from "@/hooks/useAction";
import { FontAwesome } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { AntDesign } from "@/components/ui/Icon";

export function ThreadButtonPopover({ thread }: { thread: Thread }) {
	const user = useConfigStore((state) => state.user);
	const deleteThread = useAction("deleteThread")();

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	const items1 = [
		{
			icon: <FontAwesome name="trash" size={18} className="text-foreground" />,
			label: "Delete Thread",
			onClick: async () => {
				if (!thread.id || !user.id) return console.error("No threadId or userId");
				deleteThread.action(thread.id);
			},
		},
	];

	return (
		<Popover className="hidden group-hover:flex">
			<PopoverTrigger className="absolute top-0 bottom-0 self-center right-1 group">
				<AntDesign
					name="ellipsis1"
					size={20}
					className="z-10 text-secondary-foreground/70 group-hover:text-secondary-foreground"
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
