import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { ToggleToolsSwitch } from "../agent/helpers/ToggleTools";
import { ToolsOverview } from "./ToolsOverview";
import { useUserQuery } from "@/hooks/fetchers/User/useUserQuery";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";

export function ToolView() {
    const userQuery = useUserQuery();
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const agent = userQuery.data?.defaultAgent!;
    return (
        <DrawerScreenWrapper>
            <View className="self-start w-full text-center">
                <Text className="relative">
                    Tools
                    <View className="absolute right-0 translate-x-full">
                        <ToggleToolsSwitch agent={agent} />
                    </View>
                </Text>
            </View>
            <View className="flex flex-col flex-1 w-full gap-4">
                <ToolsOverview agent={agent} />
            </View>
        </DrawerScreenWrapper>
    );
}
