import { useEffect, useState } from "react";

import { themes } from "../../constants/Theme";
import { useConfigStore } from "../../uiStore";

type Theme = "light" | "dark";

export function useColorScheme() {
	const [colorScheme, setColorSchemeState] = useState<Theme>(checkWeb());
	const themeStyles = themes.default[colorScheme];

	const setTheme = useConfigStore.use.setTheme();
	useEffect(() => setTheme(colorScheme ?? "dark"), [colorScheme]);

	const setColorScheme = (scheme: Theme) => {
		setColorSchemeState(scheme);

		if (typeof window !== "undefined") {
			window.localStorage.setItem("colorScheme", scheme);

			// Set the color scheme for the entire document
			document.documentElement.setAttribute("data-theme", scheme);
		}
	};

	const toggleColorScheme = () =>
		setColorScheme(colorScheme === "dark" ? "light" : "dark");

	useEffect(() => {
		const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = (event: MediaQueryListEvent) =>
			setColorScheme(event.matches ? "dark" : "light");

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
