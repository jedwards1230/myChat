import { usePathname } from "expo-router";

import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";
import { Icon } from "@/components/ui/Icon";

export function ToolsButton() {
    const path = usePathname();
    return (
        <LinkButton active={path === "/tools"} href={{ pathname: "/(app)/tools" }}>
            <Icon
                type="Feather"
                name="tool"
                size={20}
                className="text-secondary-foreground"
            />
            <Text className="font-medium" numberOfLines={1} ellipsizeMode="tail">
                Tools
            </Text>
        </LinkButton>
    );
}
