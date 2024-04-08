import Drawer from "@/components/DrawerNav/Drawer";
import { useConfigStore } from "@/hooks/stores/configStore";
import { Redirect } from "expo-router";

export default function HomeLayout() {
	const user = useConfigStore((state) => state.user);
	if (!user) return <Redirect href="/(auth)" />;
	return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
