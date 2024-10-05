import { View } from "react-native";

import type { Thread } from "@/types";
import LinkButton from "../LinkButton";
import { ThreadButtonPopover } from "./ThreadButtonPopover";

export function ThreadButton({ thread }: { thread: Thread }) {
	return (
		<View className="relative flex flex-row items-center w-full group/thread">
			<LinkButton
				isActive={({ threadId }) => threadId === thread.id}
				label={thread.title || "New chat"}
				className="w-full pr-4 group-hover/thread:pr-8"
				href={{ pathname: `/(app)/`, params: { c: thread.id } }}
			/>
			<ThreadButtonPopover thread={thread} />
		</View>
	);
}
