import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

import { useConfigStore } from "./stores/configStore";

export function useColorScheme() {
	const setTheme = useConfigStore((state) => state.setTheme);
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

	useEffect(() => {
		setTheme(colorScheme ?? "dark");
	}, [colorScheme]);

	return {
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
	};
}
