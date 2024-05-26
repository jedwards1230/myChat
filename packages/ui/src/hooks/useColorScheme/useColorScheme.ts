import { useEffect } from "react";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

import { themes } from "../../constants/Theme";
import { useConfigStore } from "../../uiStore";

export function useColorScheme() {
	const setTheme = useConfigStore.use.setTheme();
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	useEffect(() => setTheme(colorScheme ?? "dark"), [colorScheme]);

	return {
		themeStyles: themes.default[colorScheme ?? "dark"],
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
	};
}
