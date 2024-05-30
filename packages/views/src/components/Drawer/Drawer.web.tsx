import { View } from "react-native";

import type { DrawerHelpers } from "./types";

export const Drawer = View;

export function useDrawer(): DrawerHelpers {
	return {
		open: () => {},
		close: () => {},
		toggle: () => {},
		isDrawerOpen: false,
	};
}
