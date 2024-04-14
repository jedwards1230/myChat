import Drawer from "@/components/DrawerNav/Drawer";
import { useUserData } from "@/hooks/stores/useUserData";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function HomeLayout() {
	const session = useUserData((s) => s.session);
	if (!session) return <Redirect href="/(auth)" />;
	return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
