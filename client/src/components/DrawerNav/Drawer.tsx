import { createDrawerNavigator, DrawerNavigationOptions } from "@react-navigation/drawer";
import { Platform } from "react-native";
import { withLayoutContext } from "expo-router";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import DrawerContent from "./DrawerContent";

export const Drawer = withLayoutContext(createDrawerNavigator().Navigator);

export default function CustomDrawer() {
	const bp = useBreakpoints();

	const screenOptions: DrawerNavigationOptions = {
		drawerType: "slide",
		drawerPosition: "left",
		headerShown: false,
		// TODO: "rgba(0, 0, 0, 0.5)" | "rgba(255, 255, 255, 0.1)"
		overlayColor: Platform.OS === "web" ? "transparent" : "rgba(0, 0, 0, 0.5)",
		drawerStyle: { ...(Platform.OS === "web" && bp.md && { width: 300 }) },
	};

	return (
		<Drawer
			defaultStatus={Platform.OS === "web" && bp.md ? "open" : "closed"}
			drawerContent={(p) => <DrawerContent {...p} />}
			screenOptions={screenOptions}
			initialRouteName="index"
		>
			<Drawer.Screen name="index" />
			<Drawer.Screen name="agents" options={{ drawerLabel: "Agents" }} />
		</Drawer>
	);
}
