import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { useConfigStore } from "./stores/configStore";

export function useColorScheme() {
	const setTheme = useConfigStore((state) => state.setTheme);
	const { setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	const colorScheme = checkWeb() ? "dark" : "light";

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

// check web for match prefers dark mode
const checkWeb = () => {
	if (typeof window !== "undefined") {
		const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return darkMode;
	}
	return false;
};
