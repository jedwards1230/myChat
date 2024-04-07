import { type DrawerContentComponentProps } from "@react-navigation/drawer";
import { useEffect } from "react";
import { Platform } from "react-native";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import ThreadHistory from "../ThreadDrawer/ThreadHistory";
import NativeSafeAreaView from "../NativeSafeAreaView";

export default function DrawerContent(props: DrawerContentComponentProps) {
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
