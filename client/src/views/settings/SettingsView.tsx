import { Pressable, View } from "react-native";
import { useState } from "react";

import { Text } from "@/components/ui/Text";
import { Section } from "@/components/ui/Section";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import { cn } from "@/lib/utils";
import {
    ToggleThemeButton,
    StreamToggle,
    ResetDefaultsButton,
    DebugQueryToggle,
} from "./helpers";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";
import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { Drawer } from "@/app/(app)/_layout";

enum SideMenu {
    General = "General",
    User = "User",
    Debug = "Debug",
}

const configView = {
    [SideMenu.General]: <GeneralSettings />,
    [SideMenu.User]: <UserSettings />,
    [SideMenu.Debug]: <DebugSettings />,
};

export function SettingsView() {
    const [activeTab, setActiveTab] = useState<SideMenu>(SideMenu.General);
    const renderNavButtons = () => {
        return Object.values(SideMenu).map((menu, i) => (
            <NavButton
                key={i}
                active={activeTab === menu}
                onPress={() => setActiveTab(menu)}
            >
                {menu}
            </NavButton>
        ));
    };

    return (
        <DrawerScreenWrapper>
            <Drawer.Screen
                options={{ headerTitle: "Settings", headerTitleAlign: "center" }}
            />
            <View className="flex flex-row flex-1 w-full gap-4 px-2 py-4">
                <View className="flex flex-col gap-1 basis-1/5">
                    {renderNavButtons()}
                </View>
                <View className="flex flex-col flex-1 gap-4">
                    {configView[activeTab]}
                </View>
            </View>
        </DrawerScreenWrapper>
    );
}

function NavButton({
    children,
    active,
    onPress,
}: {
    children: React.ReactNode;
    active: boolean;
    onPress?: () => void;
}) {
    const { isHover, ...helpers } = useHoverHelper();
    return (
        <Pressable
            {...helpers}
            onPress={onPress}
            className={cn(
                "py-1.5 w-full px-2 rounded-lg",
                isHover
                    ? active
                        ? "bg-foreground/10"
                        : "bg-foreground/5"
                    : active
                    ? "bg-foreground/10"
                    : "bg-transparent"
            )}
        >
            <Text>{children}</Text>
        </Pressable>
    );
}

function GeneralSettings() {
    return (
        <>
            <Section title="Chat Host">
                <ToggleThemeButton />
                <StreamToggle />
            </Section>
            <ResetDefaultsButton />
        </>
    );
}

function DebugSettings() {
    return (
        <>
            <Section title="Debug">
                <DebugQueryToggle />
            </Section>
            <DeviceConfig />
        </>
    );
}

function UserSettings() {
    return (
        <>
            <UserConfig />
        </>
    );
}
