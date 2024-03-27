import { Aside } from "@expo/html-elements";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";

import { SettingsButton } from "./SettingsButton";
import HorizontalLine from "../ui/HorizontalLine";
import NewChatButton from "./NewChatButton";
import { AgentsButton } from "./AgentsButton";
import { useThreadListQuery } from "@/lib/queries/useThreadListQuery";
import { groupThreadsByDate, ThreadGroup } from "./ThreadGroups";

export default function ThreadHistory() {
	return (
		<Aside className="flex flex-col items-center flex-1 w-full gap-6 p-2">
			<View className="w-full">
				<NewChatButton />
				<AgentsButton />
			</View>
			<HorizontalLine />
			<ThreadList />
			<HorizontalLine />
			<SettingsButton />
		</Aside>
	);
}

function ThreadList() {
	const { data, status } = useThreadListQuery();
	const threadGroups = groupThreadsByDate(data);

	return (
		<View className="flex flex-1 w-full">
			<FlashList
				data={threadGroups}
				keyExtractor={(_, i) => i.toString()}
				estimatedItemSize={36}
				extraData={{ status }}
				initialScrollIndex={threadGroups.length - 1}
				renderItem={({ item, index }) => <ThreadGroup group={item} />}
			/>
		</View>
	);
}
