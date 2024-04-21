import { useState } from "react";
import { Pressable, View } from "react-native";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import {
    DebugQueryToggle,
    ResetDefaultsButton,
    StreamToggle,
    ToggleThemeButton,
} from "./helpers";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";

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

export default function SettingsDialog({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
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
        <Dialog className="w-full">
            <DialogTrigger asChild className={className}>
                {children}
            </DialogTrigger>

            <DialogContent className="text-foreground">
                <SettingsHeader />
                <DialogDescription className="flex flex-row gap-4">
                    <View className="flex flex-col gap-1 basis-1/5">
                        {renderNavButtons()}
                    </View>
                    <View className="flex flex-col flex-1 gap-4">
                        {configView[activeTab]}
                    </View>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

function SettingsHeader() {
    return (
        <View className="flex flex-row items-center justify-between py-4 border-b border-input">
            <DialogTitle>Settings</DialogTitle>
            <DialogClose>
                <MaterialIcons
                    name="close"
                    size={20}
                    className="text-foreground/40 hover:text-foreground"
                />
            </DialogClose>
        </View>
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
