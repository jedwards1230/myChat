import Drawer from "@/components/DrawerNav/Drawer";
import { useUserData } from "@/hooks/stores/useUserData";
import { Redirect } from "expo-router";

export default function HomeLayout() {
	const session = useUserData.use.session();
	if (!session) return <Redirect href="/(auth)" />;
	return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
