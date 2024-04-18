import { Pressable, View } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, ParamListBase, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import { Entypo } from "@/components/ui/Icon";

export function ChatViewWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex flex-row flex-1 w-full bg-background">
			<CollapseDrawer />
			<View className="flex flex-col items-center justify-between w-full">
				{children}
			</View>
		</View>
	);
}

function CollapseDrawer() {
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
	const isDrawerOpen = useDrawerStatus() === "open";

	return (
		<View className="absolute left-0 z-10 flex-row items-center justify-center hidden h-full md:flex">
			<Pressable
				className="rounded-r-lg group"
				onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
			>
				<Entypo
					className="transition-colors scale-95 text-foreground/40 group-hover:text-foreground group-hover:scale-110"
					name={isDrawerOpen ? "chevron-left" : "chevron-small-right"}
					size={20}
				/>
			</Pressable>
		</View>
	);
}