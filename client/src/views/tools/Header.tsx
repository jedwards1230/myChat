import { View } from "react-native";

import { ToggleToolsSwitch } from "../agent/helpers/ToggleTools";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { HeaderWrapper } from "../HeaderWrapper";
import { ToolDialog } from "./ToolDialog.web";
import { Text } from "@/components/ui/Text";
import { useUserQuery } from "@/hooks/fetchers/User/useUserQuery";

export function ToolHeader() {
    return (
        <HeaderWrapper>
            <HeaderTitle />
            <View className="absolute right-0 z-10 translate-x-full">
                <ToolDialog>
                    <Button className="mr-4" variant="outline" size="icon">
                        <Icon type="FontAwesome" name="plus" />
                    </Button>
                </ToolDialog>
            </View>
        </HeaderWrapper>
    );
}

function HeaderTitle() {
    const { data, isPending, isError } = useUserQuery();

    if (isError) return <Text>Error loading tools</Text>;
    if (isPending) return <Text>Loading...</Text>;
    return (
        <Text className="relative">
            <Text>Tools</Text>
            <View className="absolute right-0 z-10 translate-x-full">
                <ToggleToolsSwitch agent={data.defaultAgent} />
            </View>
        </Text>
    );
}
