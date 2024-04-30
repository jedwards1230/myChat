import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";

import HorizontalLine from "../ui/HorizontalLine";
import { useThreadListQuery } from "@/hooks/fetchers/Thread/useThreadListQuery";
import { useThreadGroups, ThreadGroup } from "./ThreadGroups";
import LinkButton from "./LinkButton";
import { Icon } from "../ui/Icon";

export default function ThreadHistory() {
	return (
		<View className="flex flex-col items-center flex-1 w-full gap-4 px-2 pt-2 pb-6">
			<View className="w-full">
				<LinkButton
					icon={<Icon type="MaterialIcons" name="open-in-new" />}
					label="New Chat"
					href={{ pathname: "/(app)/" }}
				/>
				<LinkButton
					icon={<Icon type="Ionicons" name="grid-outline" />}
					isActive={({ path }) => path === "/agents"}
					label="Agents"
					href={{ pathname: "/(app)/agents" }}
				/>
				<LinkButton
					icon={<Icon type="Feather" name="tool" />}
					isActive={({ path }) => path === "/tools"}
					label="Tools"
					href={{ pathname: "/(app)/tools" }}
				/>
			</View>
			<HorizontalLine />
			<ThreadList />
			<HorizontalLine />
			<LinkButton
				icon={<Icon type="MaterialIcons" name="settings" />}
				isActive={({ path }) => path === "/settings"}
				label="Settings"
				href={{ pathname: "/(app)/settings" }}
			/>
		</View>
	);
}

function ThreadList() {
	const { data, status, refetch } = useThreadListQuery();
	const threadGroups = useThreadGroups(data);

	return (
		<View className="flex flex-1 w-full">
			<FlashList
				data={threadGroups}
				keyExtractor={(_, i) => i.toString()}
				refreshing={status === "pending"}
				onRefresh={refetch}
				estimatedItemSize={36}
				extraData={{ status }}
				initialScrollIndex={threadGroups.length - 1}
				renderItem={({ item }) => <ThreadGroup group={item} />}
			/>
		</View>
	);
}
