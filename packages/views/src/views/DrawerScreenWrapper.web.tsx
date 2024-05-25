import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import { Pressable, View } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { Icon } from "~/native/Icon";

export function DrawerScreenWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex w-full flex-1 flex-row bg-background">
			<CollapseDrawer />
			<View className="flex w-full flex-col items-center justify-between">
				{children}
			</View>
		</View>
	);
}

function CollapseDrawer() {
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
	const isDrawerOpen = useDrawerStatus() === "open";

	return (
		<View className="absolute left-0 z-10 hidden h-full flex-row items-center justify-center md:flex">
			<Pressable
				className="group rounded-r-lg"
				onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
			>
				<Icon
					type="Entypo"
					className="scale-95 py-1 pr-1 text-foreground/40 transition-colors group-hover:scale-110 group-hover:text-foreground"
					name={isDrawerOpen ? "chevron-left" : "chevron-small-right"}
					size={20}
				/>
			</Pressable>
		</View>
	);
}
