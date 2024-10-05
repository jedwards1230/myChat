import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Redirect, withLayoutContext } from "expo-router";
import NativeSafeAreaView from "@/components/NativeSafeAreaView";
import ThreadHistory from "@/components/ThreadDrawer/ThreadHistory";
import { useUserData } from "@/hooks/stores/useUserData";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createDrawerNavigator } from "@react-navigation/drawer";

export const Drawer = withLayoutContext(createDrawerNavigator().Navigator);

export default function HomeLayout() {
	const session = useUserData.use.session();
	const bp = useBreakpoints();
	const { themeStyles } = useColorScheme();

	if (!session) return <Redirect href={{ pathname: "/(auth)" }} />;
	return (
		<Drawer
			defaultStatus={Platform.OS === "web" && bp.md ? "open" : "closed"}
			drawerContent={(p) => <DrawerContent {...p} />}
			screenOptions={{
				drawerType: "slide",
				drawerPosition: "left",
				headerBackground: () => false,
				headerLeft: Platform.OS === "web" && bp.md ? () => null : undefined,
				overlayColor:
					Platform.OS === "web" ? "transparent" : themeStyles["--overlay"],
				drawerStyle: {
					...(Platform.OS === "web" && bp.md && { width: 300 }),
					...themeStyles,
				},
			}}
			initialRouteName="index"
		/>
	);
}

function DrawerContent(props: DrawerContentComponentProps) {
	const { md } = useBreakpoints();

	useEffect(() => {
		if (Platform.OS === "web" && md) {
			props.navigation.openDrawer();
		} else {
			props.navigation.closeDrawer();
		}
	}, [md]);

	return (
		<NativeSafeAreaView
			className="flex-1 border-r-0 bg-secondary text-foreground"
			{...props}
		>
			<ThreadHistory />
		</NativeSafeAreaView>
	);
}

export { ErrorBoundary } from "expo-router";
