import { usePathname } from "expo-router";

import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";
import { Icon } from "@/components/ui/Icon";

export function AgentsButton() {
    const path = usePathname();
    return (
        <LinkButton active={path === "/agents"} href={{ pathname: "/(app)/agents" }}>
            <Icon
                type="Ionicons"
                name="grid-outline"
                size={20}
                className="text-secondary-foreground"
            />
            <Text className="font-medium" numberOfLines={1} ellipsizeMode="tail">
                Agents
            </Text>
        </LinkButton>
    );
}
