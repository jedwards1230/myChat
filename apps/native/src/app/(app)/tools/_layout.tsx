import { Stack } from "expo-router";
import { ToolHeader } from "@/views/tools/Header";

import { Drawer } from "../_layout";

export default function HomeLayout() {
	return (
		<>
			<Drawer.Screen options={{ header: ToolHeader }} />
			<Stack screenOptions={{ headerShown: false }} initialRouteName="index" />
		</>
	);
}

export { ErrorBoundary } from "expo-router";
