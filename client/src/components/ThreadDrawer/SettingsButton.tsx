import { usePathname } from "expo-router";

import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";

export function SettingsButton() {
    const path = usePathname();
    return (
        <LinkButton active={path === "/settings"} href={{ pathname: "/(app)/settings" }}>
            <Icon
                type="MaterialIcons"
                name="settings"
                size={20}
                className="text-secondary-foreground"
            />
            <Text className="font-medium">Settings</Text>
        </LinkButton>
    );
}
