import { usePathname } from "expo-router";

import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";
import { Icon } from "@/components/ui/Icon";

export function AgentsButton() {
    const path = usePathname();
    return (
        <LinkButton active={path === "/agents"} href={{ pathname: "/(app)/agents" }}>
            <Icon type="Ionicons" name="grid-outline" />
            <Text className="font-medium" ellipsizeMode="tail">
                Agents
            </Text>
        </LinkButton>
    );
}
