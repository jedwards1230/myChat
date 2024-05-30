import { Stack } from "expo-router";

import { Drawer } from "@mychat/views/components/Drawer";
import { ToolHeader } from "@mychat/views/pages/tools/Header";

export default function HomeLayout() {
	return (
		<>
			<Drawer.Screen options={{ header: ToolHeader }} />
			<Stack screenOptions={{ headerShown: false }} initialRouteName="index" />
		</>
	);
}

export { ErrorBoundary } from "expo-router";
