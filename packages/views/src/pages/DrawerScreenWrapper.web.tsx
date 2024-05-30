import { Pressable, View } from "react-native";

import { AngleLeft, AngleRight } from "@mychat/ui/svg";

import { useDrawer } from "../components/Drawer";

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
	const { isDrawerOpen, toggle } = useDrawer();
	const Icon = isDrawerOpen ? AngleLeft : AngleRight;

	return (
		<View className="absolute left-0 z-10 hidden h-full flex-row items-center justify-center md:flex">
			<Pressable className="group rounded-r-lg" onPress={toggle}>
				<Icon className="scale-95 py-1 pr-1 text-foreground/40 transition-colors group-hover:scale-110 group-hover:text-foreground" />
			</Pressable>
		</View>
	);
}
