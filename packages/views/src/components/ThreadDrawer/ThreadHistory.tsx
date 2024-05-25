import { View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api } from "@mychat/api/client/react-query";

import HorizontalLine from "~/native/HorizontalLine";
import { Icon } from "~/native/Icon";
import { Text } from "~/native/Text";
import packageInfo from "../../../../../package.json";
import LinkButton from "./LinkButton";
import { ThreadGroup, useThreadGroups } from "./ThreadGroups";

export default function ThreadHistory() {
	return (
		<View className="flex w-full flex-1 flex-col items-center gap-4 px-2 pb-2 pt-2">
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
			<View className="w-full">
				<LinkButton
					icon={<Icon type="MaterialIcons" name="settings" />}
					isActive={({ path }) => path === "/settings"}
					label="Settings"
					href={{ pathname: "/(app)/settings" }}
				/>
				{process.env.EXPO_PUBLIC_GITHUB_REPO_URL ? (
					<Link
						href={process.env.EXPO_PUBLIC_GITHUB_REPO_URL}
						className="pl-1 text-xs leading-3 text-foreground/40 hover:text-foreground"
					>
						Version: {packageInfo.version}-
						{process.env.EXPO_PUBLIC_COMMIT_HASH}
					</Link>
				) : (
					<Text className="text-xs text-foreground/40">
						Version: {packageInfo.version}-
						{process.env.EXPO_PUBLIC_COMMIT_HASH}
					</Text>
				)}
			</View>
		</View>
	);
}

function ThreadList() {
	const { data, status, refetch } = api.thread.all.useQuery();
	const threadGroups = useThreadGroups(data);

	return (
		<View className="flex w-full flex-1">
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