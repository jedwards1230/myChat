import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect, useMemo } from "react";

import { themes } from "@/lib/constants/Theme";
import { useConfigStore } from "../stores/configStore";

export function useColorScheme() {
	const setTheme = useConfigStore((state) => state.setTheme);
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	const themeStyles = useMemo(
		() => themes.default[colorScheme ?? "dark"],
		[colorScheme]
	);

	useEffect(() => {
		setTheme(colorScheme ?? "dark");
	}, [colorScheme]);

	return {
		themeStyles,
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
	};
}
