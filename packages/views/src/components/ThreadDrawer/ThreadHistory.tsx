import { View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api } from "@mychat/api/client/react-query";
import HorizontalLine from "@mychat/ui/native/HorizontalLine";
import { Text } from "@mychat/ui/native/Text";
import { AppGrid, OpenInNew, Settings, Wrench } from "@mychat/ui/svg";

import LinkButton from "./LinkButton";
import { ThreadGroup, useThreadGroups } from "./ThreadGroups";

const VERSION = "0.0.1";

export default function ThreadHistory() {
	return (
		<View className="flex w-full flex-1 flex-col items-center gap-4 px-2 pb-2 pt-2">
			<View className="w-full">
				<LinkButton
					icon={<OpenInNew />}
					label="New Chat"
					href={{ pathname: "/(app)/" }}
				/>
				<LinkButton
					icon={<AppGrid />}
					isActive={({ path }) => path === "/agents"}
					label="Agents"
					href={{ pathname: "/(app)/agents" }}
				/>
				<LinkButton
					icon={<Wrench />}
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
					icon={<Settings />}
					isActive={({ path }) => path === "/settings"}
					label="Settings"
					href={{ pathname: "/(app)/settings" }}
				/>
				{process.env.EXPO_PUBLIC_GITHUB_REPO_URL ? (
					<Link
						href={process.env.EXPO_PUBLIC_GITHUB_REPO_URL}
						className="pl-1 text-xs leading-3 text-foreground/40 hover:text-foreground"
					>
						Version: {VERSION}-{process.env.EXPO_PUBLIC_COMMIT_HASH}
					</Link>
				) : (
					<Text className="text-xs text-foreground/40">
						Version: {VERSION}-{process.env.EXPO_PUBLIC_COMMIT_HASH}
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
