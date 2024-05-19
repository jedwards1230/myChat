import { useEffect } from "react";
import { themes } from "@/lib/constants/Theme";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

import { useConfigStore } from "../stores/configStore";

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
