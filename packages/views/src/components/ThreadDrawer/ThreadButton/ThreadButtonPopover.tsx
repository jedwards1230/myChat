import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Thread } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { useUserData } from "@mychat/shared/hooks/stores/useUserData";
import { Button } from "@mychat/ui/native/Button";
import { Icon } from "@mychat/ui/native/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@mychat/ui/native/Popover";
import { Text } from "@mychat/ui/native/Text";

export function ThreadButtonPopover({ thread }: { thread: Thread }) {
	const session = useUserData((s) => s.session);
	const { mutateAsync: deleteThread } = api.thread.delete.useMutation();

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
				await deleteThread(thread.id);
			},
		},
	];

	return (
		<Popover className="hidden group-hover/thread:flex">
			<PopoverTrigger className="group absolute bottom-0 right-1 top-0 self-center">
				<Icon
					type="AntDesign"
					name="ellipsis1"
					size={20}
					className="z-10 text-secondary-foreground/70 group-hover:text-secondary-foreground group-aria-selected:text-background"
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
