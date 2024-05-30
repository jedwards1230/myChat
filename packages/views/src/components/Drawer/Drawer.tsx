import { withLayoutContext } from "expo-router";
import { createDrawerNavigator, useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import type { DrawerHelpers } from "./types";

export const Drawer = withLayoutContext(createDrawerNavigator().Navigator);

export function useDrawer(): DrawerHelpers {
	const navigation = useNavigation();
	const status = useDrawerStatus();

	return {
		open: () => navigation.dispatch(DrawerActions.openDrawer()),
		close: () => navigation.dispatch(DrawerActions.closeDrawer()),
		toggle: () => navigation.dispatch(DrawerActions.toggleDrawer()),
		isDrawerOpen: status === "open",
	};
}
