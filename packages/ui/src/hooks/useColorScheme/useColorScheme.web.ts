import { useEffect, useMemo, useState } from "react";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

import { themes } from "../../constants/Theme";
import { useConfigStore } from "../../uiStore";

export function useColorScheme() {
	const [colorScheme, setColorSchemeState] = useState<"dark" | "light">(checkWeb());
	const themeStyles = useMemo(() => themes.default[colorScheme], [colorScheme]);

	const setTheme = useConfigStore((state) => state.setTheme);
	useEffect(() => setTheme(colorScheme ?? "dark"), [colorScheme]);

	const { setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	useEffect(() => {
		const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = (event: MediaQueryListEvent) =>
			setColorSchemeState(event.matches ? "dark" : "light");

		mediaQueryList.addEventListener("change", listener);
		return () => mediaQueryList.removeEventListener("change", listener);
	}, []);

	return {
		themeStyles,
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
		return darkMode ? "dark" : "light";
	}
	return "dark";
};
