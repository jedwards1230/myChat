import { useState } from "react";
import { Pressable, View } from "react-native";
import { Drawer } from "@/app/(app)/_layout";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import { cn } from "@/lib/utils";

import { DrawerScreenWrapper } from "../DrawerScreenWrapper";
import { HeaderWrapper } from "../HeaderWrapper";
import {
	DebugQueryToggle,
	ResetDefaultsButton,
	StreamToggle,
	ToggleThemeButton,
} from "./helpers";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";

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
				options={{ header: () => <HeaderWrapper title="Settings" /> }}
			/>

			<View className="flex w-full flex-1 flex-row gap-4 px-2 py-4">
				<View className="flex basis-1/5 flex-col gap-1">
					{renderNavButtons()}
				</View>
				<View className="flex flex-1 flex-col gap-4">
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
				"w-full rounded-lg px-2 py-1.5",
				isHover
					? active
						? "bg-foreground/10"
						: "bg-foreground/5"
					: active
						? "bg-foreground/10"
						: "bg-transparent",
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
