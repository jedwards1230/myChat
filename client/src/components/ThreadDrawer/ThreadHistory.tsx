import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";

import { SettingsButton } from "./SettingsButton";
import HorizontalLine from "../ui/HorizontalLine";
import NewChatButton from "./NewChatButton";
import { AgentsButton } from "./AgentsButton";
import { useThreadListQuery } from "@/hooks/fetchers/Thread/useThreadListQuery";
import { useThreadGroups, ThreadGroup } from "./ThreadGroups";
import { ToolsButton } from "./ToolsButton";

export default function ThreadHistory() {
    return (
        <View className="flex flex-col items-center flex-1 w-full gap-4 px-2 pt-2 pb-6">
            <View className="w-full">
                <NewChatButton />
                <AgentsButton />
                <ToolsButton />
            </View>
            <HorizontalLine />
            <ThreadList />
            <HorizontalLine />
            <SettingsButton />
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
                renderItem={({ item, index }) => <ThreadGroup group={item} />}
            />
        </View>
    );
}
