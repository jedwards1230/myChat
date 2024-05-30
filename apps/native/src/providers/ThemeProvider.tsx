"use client";

import type { Theme } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { SplashScreen } from "expo-router";
import { ThemeProvider as BaseProvider } from "@react-navigation/native";

import { NAV_THEME } from "@mychat/ui/constants/ReactNavTheme";
import { useColorScheme } from "@mychat/ui/hooks/useColorScheme";
import { useConfigStore } from "@mychat/ui/uiStore";

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

type ThemeState = ReturnType<typeof useColorScheme>;

const initialState = {};

const ThemeContext = createContext<ThemeState>(initialState as ThemeState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { colorScheme, setColorScheme, isDarkColorScheme, themeStyles, ...rest } =
		useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

	useEffect(() => {
		const loadCachedTheme = async () => {
			await useConfigStore.persist.rehydrate();
			const { theme, setTheme } = useConfigStore.getState();
			if (!theme) {
				setTheme(colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}

			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		};
		loadCachedTheme().finally(() => {
			if (Platform.OS === "web") {
				const body = document.querySelector("body");
				if (body) {
					Object.entries(themeStyles).forEach(([key, value]) => {
						body.style.setProperty(key, value);
					});
				} else {
					console.error("Cannot set Theme Styles: Body not found");
				}
			}
			SplashScreen.hideAsync();
		});
	}, []);

	const value: ThemeState = {
		colorScheme,
		isDarkColorScheme,
		setColorScheme,
		themeStyles,
		...rest,
	};

	if (!isColorSchemeLoaded) return null;
	return (
		<ThemeContext.Provider value={value}>
			<BaseProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
				<View
					style={themeStyles}
					className="flex-1 bg-background text-base text-foreground"
				>
					{children}
				</View>
			</BaseProvider>
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
