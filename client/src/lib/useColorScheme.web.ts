import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { useConfigStore } from "./stores/configStore";

export function useColorScheme() {
	const setTheme = useConfigStore((state) => state.setTheme);
	const { setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	const [colorScheme, setColorSchemeState] = useState(checkWeb() ? "dark" : "light");

	useEffect(() => {
		setTheme(colorScheme ?? "dark");
	}, [colorScheme]);

	useEffect(() => {
		const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = (event: MediaQueryListEvent) =>
			setColorSchemeState(event.matches ? "dark" : "light");

		mediaQueryList.addEventListener("change", listener);
		return () => mediaQueryList.removeEventListener("change", listener);
	}, []);

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
